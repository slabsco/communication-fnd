import { GetItem, UserBusiness } from '@finnoto/core';

import * as lamejs from '@breezystack/lamejs';

export const convertBlobToMp3 = async (blob: Blob): Promise<Blob> => {
    // Convert Blob to ArrayBuffer
    const arrayBuffer = await blob.arrayBuffer();

    // Decode audio to PCM using AudioContext
    const audioCtx = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

    // Only use the first channel for simplicity
    const samples = audioBuffer.getChannelData(0);

    // Create MP3 encoder: channels, sampleRate, kbps
    const mp3Encoder = new lamejs.Mp3Encoder(
        audioBuffer.numberOfChannels,
        audioBuffer.sampleRate,
        128
    );

    const sampleBlockSize = 1152;
    let mp3Data: Uint8Array[] = [];

    for (let i = 0; i < samples.length; i += sampleBlockSize) {
        const sampleChunk = samples.subarray(i, i + sampleBlockSize);
        const mp3buf = mp3Encoder.encodeBuffer(floatTo16BitPCM(sampleChunk));
        if (mp3buf.length > 0) mp3Data.push(mp3buf);
    }

    const mp3buf = mp3Encoder.flush();
    if (mp3buf.length > 0) mp3Data.push(mp3buf);

    return new Blob(mp3Data, { type: 'audio/mpeg' });
};

// helper: convert float [-1,1] → 16-bit PCM
const floatTo16BitPCM = (input: Float32Array) => {
    const output = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
        let s = Math.max(-1, Math.min(1, input[i]));
        output[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return output;
};

export const uploadAudioMp3 = async (blobss: Blob) => {
    const blob = await convertBlobToMp3(blobss);

    const formData = new FormData();
    const file = new File([blob], 'recording.mp3', { type: blob?.type });
    formData.append('file', file);

    const baseUrl = UserBusiness.getBusinessAPIUrl();
    const response = await fetch(`${baseUrl}api/b/upload-files`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${GetItem('ACCESS_TOKEN', false)}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(`Failed to upload audio: ${response.status} ${text}`);
    }

    const data = await response.json();
    return data?.[0];
};
