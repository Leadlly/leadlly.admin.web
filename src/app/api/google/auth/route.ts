import { NextRequest, NextResponse } from 'next/server';

import apiClient from '@/apiClient/apiClient';

export async function POST(req: NextRequest) {
  try {

    const body = await req.json();
    console.log(body, "here is the body");

    const response = await apiClient.post('/api/google/auth', body);
    
    const { token, ...userData } = response.data;
    
    const res = NextResponse.json(userData);

    res.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
      expires: new Date('9999-12-31T23:59:59Z')
    });    
    
    return res;
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: error.response?.status || 500 });
  }
}
