type PathKeys<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? K | `${K}.${PathKeys<T[K]>}`
        : K;
    }[keyof T & string]
  : never;

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

function solution(path: string = 'auth.jwt.issuer') {
  const config = {
    auth: {
      jwt: {
        issuer: 'auth.enterprise.io',
        expiry: '1h'
      }
    },
    database: {
      pool: {
        max: 20
      }
    }
  };

  const val = getNestedValue(config, path || 'auth.jwt.issuer');
  return typeof val === 'object' ? JSON.stringify(val) : String(val);
}
