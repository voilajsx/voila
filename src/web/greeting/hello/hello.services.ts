import { http } from '@voilajsx/uikit/http';
import { logger } from '@voilajsx/uikit/logging';
import { utility } from '@voilajsx/uikit/utils';
import { type HelloResponse } from './hello.models';

const log = logger.get('hello.service');
const utils = utility.get();

export class HelloService {
  private static readonly BASE_URL = '/api/greeting/hello';

  static async getDefaultGreeting(): Promise<HelloResponse> {
    const requestId = utils.uuid();
    
    try {
      log.info('Fetching default greeting', { requestId });
      
      const response = await http.get<HelloResponse>(this.BASE_URL);
      
      log.info('Default greeting fetched successfully', { requestId });
      return response.data;
      
    } catch (error: any) {
      log.error('Failed to fetch default greeting', { requestId, error: error.message });
      throw error;
    }
  }

  static async getGreetingByName(name: string): Promise<HelloResponse> {
    const requestId = utils.uuid();
    
    try {
      log.info('Fetching greeting by name', { requestId, name });
      
      const response = await http.get<HelloResponse>(`${this.BASE_URL}/${encodeURIComponent(name)}`);
      
      log.info('Greeting by name fetched successfully', { requestId, name });
      return response.data;
      
    } catch (error: any) {
      log.error('Failed to fetch greeting by name', { requestId, name, error: error.message });
      throw error;
    }
  }
}