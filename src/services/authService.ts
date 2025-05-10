import axios from 'axios';
import { LoginRequest } from '../types/AuthTypes';
import { BASE_URL } from '../config/api';


const API_URL = `http://${BASE_URL}/login/autenticar`;

export async function loginUser(data: LoginRequest) {
  console.log(API_URL)
  return axios.post(API_URL, data);
}
