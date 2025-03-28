import axios from 'axios';
import config from '../config/config';
import { PricingParameters, PricingResult } from '../pricing/interfaces/pricing-module.interface';

export const windowCleaningClient = {
  calculate: async (params: PricingParameters): Promise<PricingResult> => {
    const { data } = await axios.post(`${config.WINDOW_CLEANING_SERVICE_URL}/calculate`, params);
    return data;
  },
};
