export const pick = (obj: any, keys: string[]) => {
  const ojbectKeys: Record<string, any> = {};
  for (const key of keys) {
    if (obj && Object.hasOwnProperty.call(obj, key)) {
      ojbectKeys[key] = obj[key];
    }
  }
  console.log("ojbectKeys", ojbectKeys);
  return ojbectKeys;
};
