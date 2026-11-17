/**
 * ====================================================================
 * SHA-256 Secure Hash Generator - Core Cryptographic Engine
 * Course: Cryptography and Network Security (CNS)
 * Technology: Web Crypto API (SubtleCrypto)
 * ====================================================================
 */

const CryptoEngine = {
    /**
     * Supported SHA algorithm variants supported by Web Crypto API
     */
    SUPPORTED_ALGORITHMS: ['SHA-256', 'SHA-1', 'SHA-384', 'SHA-512'],

    /**
     * Converts an ArrayBuffer to a lowercase hexadecimal string.
     * @param {ArrayBuffer} buffer
     * @returns {string} Hexadecimal string
     */
    bufferToHex(buffer) {
        const byteArray = new Uint8Array(buffer);
        const hexCodes = [];
        for (let i = 0; i < byteArray.length; i++) {
            const hex = byteArray[i].toString(16).padStart(2, '0');
            hexCodes.push(hex);
        }
        return hexCodes.join('');
    },

    /**
     * Converts a hexadecimal string to a binary string representation.
     * @param {string} hex
     * @returns {string} Binary string (e.g. '01101001...')
     */
    hexToBinary(hex) {
        return hex
            .split('')
            .map(char => parseInt(char, 16).toString(2).padStart(4, '0'))
            .join('');
    },

    /**
     * Hashes text using the specified SHA algorithm via Web Crypto API.
     * @param {string} text - Plain text input
     * @param {string} algorithm - 'SHA-256' | 'SHA-512' | 'SHA-384' | 'SHA-1'
     * @returns {Promise<{hash: string, durationMs: number, bitLength: number, byteLength: number}>}
     */
    async hashText(text, algorithm = 'SHA-256') {
        const startTime = performance.now();
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        
        const hashBuffer = await window.crypto.subtle.digest(algorithm, data);
        const durationMs = performance.now() - startTime;
        const hash = this.bufferToHex(hashBuffer);

        return {
            hash,
            durationMs: Number(durationMs.toFixed(3)),
            bitLength: hashBuffer.byteLength * 8,
            byteLength: hashBuffer.byteLength,
            inputBytes: data.length
        };
    },

    /**
     * Hashes an ArrayBuffer (e.g., from an uploaded file) using Web Crypto API.
     * @param {ArrayBuffer} buffer - File buffer
     * @param {string} algorithm - Cryptographic algorithm
     * @returns {Promise<{hash: string, durationMs: number, bitLength: number}>}
     */
    async hashBuffer(buffer, algorithm = 'SHA-256') {
        const startTime = performance.now();
        const hashBuffer = await window.crypto.subtle.digest(algorithm, buffer);
        const durationMs = performance.now() - startTime;
        const hash = this.bufferToHex(hashBuffer);

        return {
            hash,
            durationMs: Number(durationMs.toFixed(2)),
            bitLength: hashBuffer.byteLength * 8,
            byteLength: hashBuffer.byteLength
        };
    },

    /**
     * Compares two cryptographic hash strings.
     * @param {string} hashA 
     * @param {string} hashB 
     * @returns {{isMatch: boolean, reason: string, lengthA: number, lengthB: number}}
     */
    compareHashes(hashA, hashB) {
        const cleanA = (hashA || '').trim().toLowerCase();
        const cleanB = (hashB || '').trim().toLowerCase();

        if (!cleanA || !cleanB) {
            return {
                isMatch: false,
                reason: 'Please enter both hash values to perform verification.',
                lengthA: cleanA.length,
                lengthB: cleanB.length
            };
        }

        if (cleanA.length !== cleanB.length) {
            return {
                isMatch: false,
                reason: `Length mismatch! Hash A is ${cleanA.length} characters, while Hash B is ${cleanB.length} characters.`,
                lengthA: cleanA.length,
                lengthB: cleanB.length
            };
        }

        const isMatch = cleanA === cleanB;
        return {
            isMatch,
            reason: isMatch
                ? 'Integrity Verified: Both cryptographic hashes are identical. Data is authentic and untampered.'
                : 'Integrity Compromised: Hashes do not match! The data has been modified or corrupted.',
            lengthA: cleanA.length,
            lengthB: cleanB.length
        };
    },

    /**
     * Demonstrates the Cryptographic Avalanche Effect by computing hashes for
     * two inputs and calculating bit-level differences.
     * @param {string} textA 
     * @param {string} textB 
     * @param {string} algorithm 
     * @returns {Promise<object>}
     */
    async computeAvalanche(textA, textB, algorithm = 'SHA-256') {
        const resA = await this.hashText(textA, algorithm);
        const resB = await this.hashText(textB, algorithm);

        const binA = this.hexToBinary(resA.hash);
        const binB = this.hexToBinary(resB.hash);

        const totalBits = binA.length;
        let diffBits = 0;
        const bitComparison = [];

        for (let i = 0; i < totalBits; i++) {
            const match = binA[i] === binB[i];
            if (!match) diffBits++;
            bitComparison.push({
                index: i,
                bitA: binA[i],
                bitB: binB[i],
                isDiff: !match
            });
        }

        const flippedPercentage = totalBits > 0 ? ((diffBits / totalBits) * 100).toFixed(2) : '0.00';

        // Hex level differences
        let diffHexChars = 0;
        const hexA = resA.hash;
        const hexB = resB.hash;
        const hexComparison = [];

        for (let j = 0; j < hexA.length; j++) {
            const isDiff = hexA[j] !== hexB[j];
            if (isDiff) diffHexChars++;
            hexComparison.push({
                index: j,
                charA: hexA[j],
                charB: hexB[j],
                isDiff
            });
        }

        return {
            hashA: resA.hash,
            hashB: resB.hash,
            binA,
            binB,
            totalBits,
            diffBits,
            flippedPercentage,
            diffHexChars,
            totalHexChars: hexA.length,
            bitComparison,
            hexComparison
        };
    },

    /**
     * Utility to format byte sizes into readable strings.
     * @param {number} bytes 
     * @returns {string} Formatted size (e.g. "1.45 MB")
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
};

if (typeof window !== 'undefined') {
    window.CryptoEngine = CryptoEngine;
}

