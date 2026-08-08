interface GeoIpData {
  country?: string;
  city?: string;
  region?: string;
  isp?: string;
}

export function parseUserAgent(ua: string) {
  let browser = 'Browser';
  let os = 'OS';
  let device = 'Desktop';

  if (/mobile/i.test(ua)) device = 'Mobile';
  else if (/ipad|tablet/i.test(ua)) device = 'Tablet';

  if (/windows/i.test(ua)) os = 'Windows';
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/linux/i.test(ua)) os = 'Linux';

  if (/edg/i.test(ua)) browser = 'Edge';
  else if (/chrome/i.test(ua)) browser = 'Chrome';
  else if (/safari/i.test(ua)) browser = 'Safari';
  else if (/firefox/i.test(ua)) browser = 'Firefox';

  return { browser, os, device };
}

export async function getGeoIpInfo(ip: string): Promise<GeoIpData> {
  if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return { country: 'Localhost / Dev', city: 'Dev Studio', region: 'Localhost', isp: 'Internal Loopback' };
  }

  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=country,city,regionName,isp,status`);
    const json = await res.json();
    if (json && json.status === 'success') {
      return {
        country: json.country || 'Unknown Country',
        city: json.city || 'Unknown City',
        region: json.regionName || '',
        isp: json.isp || 'Unknown ISP',
      };
    }
  } catch {
    // fallback
  }

  return { country: 'Global Visitor', city: 'Location Detected', region: '', isp: '' };
}
