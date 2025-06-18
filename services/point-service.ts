export interface ActivityType {
  attendance: 5
  water: 5
  nutrient: 10
  emotion: 10
  quiz: 10
  lastleaf: 10
  register: 10
  survey: 5
}

export class PointService {
  // 활동별 포인트 정의
  static readonly ACTIVITY_POINTS: ActivityType = {
    attendance: 5,
    water: 5,
    nutrient: 10,
    emotion: 10,
    quiz: 10,
    lastleaf: 10,
    register: 10,
    survey: 5,
  }

  // 가족 수별 레벨업 경험치 테이블
  static readonly EXP_THRESHOLDS = {
    2: [150, 200, 250, 300], // 2명 가족
    3: [200, 250, 300, 350], // 3명 가족
    4: [250, 300, 350, 400], // 4명 가족
    5: [300, 350, 400, 450], // 5명 가족
  }

  /**
   * 특정 레벨에서 다음 레벨로 가기 위한 경험치 임계값 반환
   * @param memberCount 가족 구성원 수
   * @param level 현재 레벨 (1-4)
   * @returns 다음 레벨까지 필요한 경험치
   */
  static getExpThreshold(memberCount: number, level: number): number {
    const familySize = Math.max(2, Math.min(5, memberCount)) as keyof typeof this.EXP_THRESHOLDS
    const thresholds = this.EXP_THRESHOLDS[familySize]

    if (level < 1 || level > 4) return 0
    return thresholds[level - 1]
  }

  /**
   * 활동 타입에 따른 포인트 반환
   * @param activityType 활동 타입
   * @returns 해당 활동의 포인트
   */
  static getActivityPoints(activityType: keyof ActivityType): number {
    return this.ACTIVITY_POINTS[activityType]
  }

  /**
   * 현재 경험치 기준 퍼센트 계산
   * @param currentExp 현재 경험치
   * @param memberCount 가족 구성원 수
   * @param level 현재 레벨
   * @returns 퍼센트 (0-100)
   */
  static getProgressPercentage(currentExp: number, memberCount: number, level: number): number {
    if (level >= 5) return 100

    const threshold = this.getExpThreshold(memberCount, level)
    if (threshold === 0) return 0

    return Math.min(100, Math.floor((currentExp / threshold) * 100))
  }

  /**
   * 다음 레벨까지 남은 경험치 계산
   * @param currentExp 현재 경험치
   * @param memberCount 가족 구성원 수
   * @param level 현재 레벨
   * @returns 남은 경험치
   */
  static getRemainingExp(currentExp: number, memberCount: number, level: number): number {
    if (level >= 5) return 0

    const threshold = this.getExpThreshold(memberCount, level)
    return Math.max(0, threshold - currentExp)
  }

  /**
   * 활동 중복 체크 (하루 1회 제한)
   * @param activityType 활동 타입
   * @param userId 사용자 ID
   * @returns 오늘 이미 수행했는지 여부
   */
  static checkActivityExists(activityType: keyof ActivityType, userId: string): boolean {
    const today = new Date().toDateString()
    const key = `activity_${activityType}_${userId}_${today}`
    return localStorage.getItem(key) !== null
  }

  /**
   * 활동 기록 저장
   * @param activityType 활동 타입
   * @param userId 사용자 ID
   */
  static recordActivity(activityType: keyof ActivityType, userId: string): void {
    const today = new Date().toDateString()
    const key = `activity_${activityType}_${userId}_${today}`
    localStorage.setItem(key, new Date().toISOString())
  }
}
