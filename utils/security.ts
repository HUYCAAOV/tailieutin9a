// Simple utility to simulate generating a unique Device ID
// In a real app, this would use more advanced fingerprinting libraries
export const getDeviceId = (): string => {
  let deviceId = localStorage.getItem('secure_device_id');
  
  if (!deviceId) {
    const userAgent = navigator.userAgent;
    const screenRes = `${window.screen.width}x${window.screen.height}`;
    const randomSeed = Math.random().toString(36).substring(2, 15);
    const rawString = `${userAgent}-${screenRes}-${randomSeed}`;
    
    // Simple hash simulation
    let hash = 0;
    for (let i = 0; i < rawString.length; i++) {
      const char = rawString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    
    deviceId = `DEV-${Math.abs(hash).toString(16).toUpperCase()}`;
    localStorage.setItem('secure_device_id', deviceId);
  }
  
  return deviceId;
};

export const verifyDeviceBinding = (doc: any, currentDeviceId: string): boolean => {
  if (!doc.boundDeviceId) return true; // Not bound yet (shouldn't happen for purchased docs in this logic)
  return doc.boundDeviceId === currentDeviceId;
};