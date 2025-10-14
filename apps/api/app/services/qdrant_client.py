"""Qdrant client for semantic search and retrieval."""

import json
import os
from pathlib import Path
from typing import List, Dict, Optional, Any
import logging

try:
    from qdrant_client import QdrantClient
    from qdrant_client.models import Distance, VectorParams, PointStruct
    from sentence_transformers import SentenceTransformer
    QDRANT_AVAILABLE = True
except ImportError:
    QDRANT_AVAILABLE = False
    print("Warning: Qdrant or sentence-transformers not available. Retrieval will be disabled.")

logger = logging.getLogger(__name__)


class QdrantRetrievalClient:
    """Client for semantic search using Qdrant and sentence transformers."""
    
    def __init__(self):
        """Initialize the Qdrant client."""
        self.client = None
        self.model = None
        self.collection_name = "shaheen_corpus"
        self.embeddings_disabled = os.getenv("DISABLE_EMBEDDINGS", "false").lower() == "true"
        
        if not QDRANT_AVAILABLE:
            logger.warning("Qdrant or sentence-transformers not available. Retrieval disabled.")
            return
            
        if self.embeddings_disabled:
            logger.info("Embeddings disabled via DISABLE_EMBEDDINGS environment variable.")
            return
            
        self._initialize_client()
        self._initialize_model()
        self._ensure_collection()
        self._load_corpus()
    
    def _initialize_client(self):
        """Initialize Qdrant client."""
        try:
            qdrant_url = os.getenv("QDRANT_URL", "http://localhost:6333")
            self.client = QdrantClient(url=qdrant_url)
            logger.info(f"Connected to Qdrant at {qdrant_url}")
        except Exception as e:
            logger.error(f"Failed to connect to Qdrant: {e}")
            self.client = None
    
    def _initialize_model(self):
        """Initialize sentence transformer model."""
        try:
            # Use a lightweight model that works well with Arabic
            self.model = SentenceTransformer('all-MiniLM-L6-v2')
            logger.info("Initialized sentence transformer model")
        except Exception as e:
            logger.error(f"Failed to initialize sentence transformer: {e}")
            self.model = None
    
    def _ensure_collection(self):
        """Ensure the collection exists with proper configuration."""
        if not self.client:
            return
            
        try:
            # Check if collection exists
            collections = self.client.get_collections()
            collection_names = [col.name for col in collections.collections]
            
            if self.collection_name not in collection_names:
                # Create collection with cosine similarity
                self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(
                        size=384,  # all-MiniLM-L6-v2 embedding size
                        distance=Distance.COSINE
                    )
                )
                logger.info(f"Created collection: {self.collection_name}")
            else:
                logger.info(f"Collection {self.collection_name} already exists")
                
        except Exception as e:
            logger.error(f"Failed to ensure collection: {e}")
    
    def _load_corpus(self):
        """Load corpus data into Qdrant."""
        if not self.client or not self.model:
            return
            
        try:
            # Check if collection already has data
            collection_info = self.client.get_collection(self.collection_name)
            if collection_info.points_count > 0:
                logger.info(f"Collection {self.collection_name} already has {collection_info.points_count} points")
                return
            
            # Load corpus from JSONL file
            corpus_path = Path(__file__).parent.parent.parent / "assets" / "shaheen_corpus.jsonl"
            if not corpus_path.exists():
                logger.warning(f"Corpus file not found: {corpus_path}")
                return
            
            points = []
            with open(corpus_path, 'r', encoding='utf-8') as f:
                for i, line in enumerate(f):
                    if line.strip():
                        try:
                            data = json.loads(line)
                            text = data.get('text_ar', '')
                            
                            if text:
                                # Generate embedding
                                embedding = self.model.encode(text).tolist()
                                
                                # Create point
                                point = PointStruct(
                                    id=i,
                                    vector=embedding,
                                    payload={
                                        'dialect': data.get('dialect', ''),
                                        'emotion': data.get('emotion', ''),
                                        'metaphor': data.get('metaphor', ''),
                                        'lesson': data.get('lesson', ''),
                                        'text_ar': text
                                    }
                                )
                                points.append(point)
                                
                        except json.JSONDecodeError as e:
                            logger.warning(f"Failed to parse line {i}: {e}")
                            continue
            
            # Insert points in batches
            if points:
                self.client.upsert(
                    collection_name=self.collection_name,
                    points=points
                )
                logger.info(f"Loaded {len(points)} corpus entries into Qdrant")
            
        except Exception as e:
            logger.error(f"Failed to load corpus: {e}")
    
    def retrieve_similar(self, text_ar: str, k: int = 3) -> List[Dict[str, Any]]:
        """
        Retrieve similar text fragments from the corpus.
        
        Args:
            text_ar: Arabic text to find similar content for
            k: Number of similar fragments to retrieve
            
        Returns:
            List of similar fragments with metadata
        """
        if self.embeddings_disabled or not self.client or not self.model:
            logger.info("Retrieval disabled, returning empty results")
            return []
        
        try:
            # Generate embedding for input text
            query_embedding = self.model.encode(text_ar).tolist()
            
            # Search for similar vectors
            search_results = self.client.search(
                collection_name=self.collection_name,
                query_vector=query_embedding,
                limit=k
            )
            
            # Format results
            results = []
            for result in search_results:
                results.append({
                    'text_ar': result.payload.get('text_ar', ''),
                    'emotion': result.payload.get('emotion', ''),
                    'metaphor': result.payload.get('metaphor', ''),
                    'lesson': result.payload.get('lesson', ''),
                    'dialect': result.payload.get('dialect', ''),
                    'score': result.score
                })
            
            logger.info(f"Retrieved {len(results)} similar fragments")
            return results
            
        except Exception as e:
            logger.error(f"Failed to retrieve similar text: {e}")
            return []
    
    def get_corpus_stats(self) -> Dict[str, Any]:
        """Get statistics about the corpus."""
        if not self.client:
            return {"error": "Qdrant client not available"}
        
        try:
            collection_info = self.client.get_collection(self.collection_name)
            return {
                "collection_name": self.collection_name,
                "points_count": collection_info.points_count,
                "vector_size": collection_info.config.params.vectors.size,
                "distance_metric": collection_info.config.params.vectors.distance
            }
        except Exception as e:
            return {"error": f"Failed to get corpus stats: {e}"}


# Global instance
qdrant_client = QdrantRetrievalClient()
