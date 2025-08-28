import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';

import { useMutation } from '@finnoto/core';
import { cn, IconButton, Loading } from '@finnoto/design-system';

import { uploadAudioMp3 } from '../utils/audio.utl';

import { AudioSvgIcon } from 'assets';

type AudioRecorderComponentProps = {
    getAudioUrl: (url: string) => void;
};

const AudioRecorderComponent = ({
    getAudioUrl,
}: AudioRecorderComponentProps) => {
    const recorderControls = useAudioRecorder();

    const { mutate: uploadAudioMutation, isPending } = useMutation({
        mutationFn: uploadAudioMp3,
        onSuccess: (url) => {
            getAudioUrl(url);
        },
        onError: (error) => {
            console.error('Error uploading audio:', error);
        },
    });

    return (
        <div className='flex items-center my-1'>
            {isPending && (
                <div className='mx-2'>
                    <Loading size='sm' color='neutral' type='dots' />
                </div>
            )}
            {!recorderControls.isRecording && !isPending ? (
                <IconButton
                    icon={AudioSvgIcon}
                    name='Send Audio Message'
                    onClick={recorderControls.startRecording}
                    outline
                    size='sm'
                    appearance='polaris-transparent'
                />
            ) : null}
            <AudioRecorder
                classes={{
                    AudioRecorderStartSaveClass: 'hidden ',
                    AudioRecorderClass: cn('!w-0 !shadow-none', {
                        '!w-auto': recorderControls?.isRecording,
                    }),
                }}
                recorderControls={recorderControls}
                onRecordingComplete={uploadAudioMutation}
                audioTrackConstraints={{
                    noiseSuppression: true,
                    echoCancellation: true,
                }}
                downloadOnSavePress={false}
                showVisualizer
            />
        </div>
    );
};

export default AudioRecorderComponent;
