// Encryption function
export const encryptPassword = async (password: string, secretKey: CryptoKey): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  
  // Generate a random initialization vector (IV)
  const iv = crypto.getRandomValues(new Uint8Array(16));

  // Use the derived key to encrypt the data
  const derivedKey = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: iv, iterations: 100000, hash: 'SHA-256' },
    secretKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt']
  );

  const encryptedData = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    derivedKey,
    data
  );

  // Combine IV and ciphertext
  const combined = new Uint8Array(iv.length + new Uint8Array(encryptedData).length);
  combined.set(iv);
  combined.set(new Uint8Array(encryptedData), iv.length);

  // Convert the combined Uint8Array to a base64-encoded string
  const encriptPassString = btoa(String.fromCharCode(...combined));

  return encriptPassString;
}; 
  // Decryption function
  export const decryptPassword = async (encryptedDataString: string, secretKey: CryptoKey): Promise<string> => {
    // Decode the base64-encoded string to a Uint8Array
    const combined = new Uint8Array(atob(encryptedDataString).split('').map(char => char.charCodeAt(0)));

    // Extract the IV from the combined Uint8Array
    const iv = combined.slice(0, 16);
    const ciphertext = combined.slice(16);

    // Use the derived key and IV to decrypt the data
    const derivedKey = await crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt: iv, iterations: 100000, hash: 'SHA-256' },
        secretKey,
        { name: 'AES-GCM', length: 256 },
        true,
        ['decrypt']
    );

    // Use the derived key and IV to decrypt the data
    const decryptedData = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        derivedKey,
        ciphertext
    );

    // Convert the decrypted data to a string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
};


  