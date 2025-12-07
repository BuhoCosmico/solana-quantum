import { apiClient } from './client';
import { Robot, RobotCreate, RobotMetrics } from '@/types/robot';
import { ExecutePayload, ExecuteResponse } from '@/types/payment';

export const robotsAPI = {
  async listRobots(params?: {
    category?: string;
    status?: string;
    skip?: number;
    limit?: number;
  }): Promise<{ robots: Robot[]; total: number }> {
    const response = await apiClient.get('/robots', { params });
    return response.data;
  },

  async getRobot(robotId: string): Promise<Robot> {
    const response = await apiClient.get<Robot>(`/robots/${robotId}`);
    return response.data;
  },

  async createRobot(data: RobotCreate): Promise<Robot> {
    const response = await apiClient.post<Robot>('/robots', data);
    return response.data;
  },

  async updateRobot(
    robotId: string,
    data: Partial<RobotCreate>
  ): Promise<Robot> {
    const response = await apiClient.patch<Robot>(`/robots/${robotId}`, data);
    return response.data;
  },

  async deleteRobot(robotId: string): Promise<void> {
    await apiClient.delete(`/robots/${robotId}`);
  },

  async getRobotMetrics(robotId: string): Promise<RobotMetrics> {
    const response = await apiClient.get<RobotMetrics>(
      `/robots/${robotId}/metrics`
    );
    return response.data;
  },

  async executeRobot(
    robotId: string,
    payload: ExecutePayload
  ): Promise<ExecuteResponse> {
    const response = await apiClient.post<ExecuteResponse>(
      `/execute/${robotId}`,
      payload
    );
    return response.data;
  },
};
