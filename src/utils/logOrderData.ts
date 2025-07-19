export function logOrderData(orderData: any) {
  console.log('=== ORDER DATA YANG DIKIRIM KE API ===');
  console.log(JSON.stringify(orderData, null, 2));
  console.log('======================================');
} 