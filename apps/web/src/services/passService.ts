import { BusPass } from '@gsrtc/types';
import { GSRTCStorageEngine } from './storageEngine';

export interface CreatePassParams {
  passType: 'COMMUTER_MONTHLY' | 'STUDENT_SEMESTER' | 'SENIOR_CITIZEN';
  applicantName: string;
  sourceStation: string;
  destinationStation: string;
  routeVia: string;
  concessionPercentage: number;
  totalCost: number;
}

export class PassService {
  public static getAllPasses(): BusPass[] {
    return GSRTCStorageEngine.getPasses();
  }

  public static applyForPass(params: CreatePassParams): BusPass {
    const randomId = Math.floor(100000 + Math.random() * 900000);
    const passNumber = `GSRTC-PASS-${randomId}`;

    const now = new Date();
    const validFrom = now.toISOString().split('T')[0];
    const expiryDays = params.passType === 'COMMUTER_MONTHLY' ? 30 : params.passType === 'STUDENT_SEMESTER' ? 180 : 365;
    const validToDate = new Date(now.getTime() + expiryDays * 24 * 60 * 60 * 1000);
    const validTo = validToDate.toISOString().split('T')[0];

    const newPass: BusPass = {
      passNumber,
      passType: params.passType,
      applicantName: params.applicantName,
      sourceStation: params.sourceStation,
      destinationStation: params.destinationStation,
      routeVia: params.routeVia,
      validFrom,
      validTo,
      concessionPercentage: params.concessionPercentage,
      totalCost: params.totalCost,
      status: 'ACTIVE',
    };

    GSRTCStorageEngine.savePass(newPass);
    return newPass;
  }
}
