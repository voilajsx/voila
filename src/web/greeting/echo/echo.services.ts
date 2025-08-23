import { http } from '@voilajsx/uikit/http';
import { logger } from '@voilajsx/uikit/logging';
import { utility } from '@voilajsx/uikit/utils';
import { type EchoResponse, type EchoRequest } from './echo.models';

const log = logger.get('echo.service');
const utils = utility.get();

export class EchoService {
  private static readonly BASE_URL = '/api/greeting/echo';

  static async echoMessage(message: string): Promise<EchoResponse> {
    const requestId = utils.uuid();
    
    try {
      log.info('Sending echo message via POST', { requestId, messageLength: message.length });
      
      const payload: EchoRequest = { message };
      const response = await http.post<EchoResponse>(this.BASE_URL, payload);
      
      log.info('Echo message sent successfully', { requestId });
      return response.data;
      
    } catch (error: any) {
      log.error('Failed to send echo message', { requestId, error: error.message });
      throw error;
    }
  }

  static async echoMessageGet(message: string): Promise<EchoResponse> {
    const requestId = utils.uuid();
    
    try {
      log.info('Sending echo message via GET', { requestId, messageLength: message.length });
      
      const response = await http.get<EchoResponse>(`${this.BASE_URL}/${encodeURIComponent(message)}`);
      
      log.info('Echo message (GET) sent successfully', { requestId });
      return response.data;
      
    } catch (error: any) {
      log.error('Failed to send echo message (GET)', { requestId, error: error.message });
      throw error;
    }
  }
}