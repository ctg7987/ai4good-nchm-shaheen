import { db, FeatherLedger } from './database';

export interface FeatherEarning {
  type: string;
  amount: number;
  description?: string;
}

export class FeatherService {
  /**
   * Add feathers to the ledger
   */
  static async addFeathers(earning: FeatherEarning): Promise<void> {
    const ledgerEntry: Omit<FeatherLedger, 'id'> = {
      timestamp: new Date(),
      type: earning.type,
      amount: earning.amount,
      description: earning.description,
    };

    await db.featherLedger.add(ledgerEntry);
  }

  /**
   * Get total feathers earned
   */
  static async getTotalFeathers(): Promise<number> {
    const entries = await db.featherLedger.toArray();
    return entries.reduce((total, entry) => total + entry.amount, 0);
  }

  /**
   * Get recent feather earnings
   */
  static async getRecentEarnings(limit: number = 10): Promise<FeatherLedger[]> {
    return await db.featherLedger
      .orderBy('timestamp')
      .reverse()
      .limit(limit)
      .toArray();
  }

  /**
   * Get feathers by type
   */
  static async getFeathersByType(type: string): Promise<FeatherLedger[]> {
    return await db.featherLedger
      .where('type')
      .equals(type)
      .toArray();
  }

  /**
   * Award feathers for task completion
   */
  static async awardTaskCompletion(taskType: string): Promise<void> {
    await this.addFeathers({
      type: 'task_completion',
      amount: 1,
      description: `Completed ${taskType} task`,
    });
  }

  /**
   * Award feathers for daily check-in
   */
  static async awardDailyCheckin(): Promise<void> {
    await this.addFeathers({
      type: 'daily_checkin',
      amount: 1,
      description: 'Daily mood check-in',
    });
  }

  /**
   * Award feathers for reflection
   */
  static async awardReflection(): Promise<void> {
    await this.addFeathers({
      type: 'reflection',
      amount: 1,
      description: 'Completed reflection',
    });
  }

  /**
   * Award bonus feathers
   */
  static async awardBonus(reason: string, amount: number = 1): Promise<void> {
    await this.addFeathers({
      type: 'bonus',
      amount,
      description: reason,
    });
  }
}
