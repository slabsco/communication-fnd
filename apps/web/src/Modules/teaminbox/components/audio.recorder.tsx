import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';

import { useMutation } from '@finnoto/core';
import { Button, cn, IconButton, Loading } from '@finnoto/design-system';

import { uploadAudioMp3 } from '../utils/audio.utl';

import { AudioSvgIcon, DeleteSvgIcon } from 'assets';

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

export const RenderAudioRecorded = ({
    audioUrl,
    onClickSend,
    setAudio,
}: {
    audioUrl: string;
    onClickSend: (next: any) => Promise<void> | void;
    setAudio: (audio: null) => void;
}) => {
    return (
        <div className='sticky right-0 bottom-0 left-0 gap-1 mx-2 rounded shadow-inner col-flex'>
            <div className='flex gap-3 items-center'>
                <audio controls src={audioUrl} style={{ width: '100%' }}>
                    Your browser does not support the audio element.
                </audio>
                <Button onClick={onClickSend}>Send</Button>
                <IconButton
                    name='Remove Audio'
                    icon={DeleteSvgIcon}
                    appearance='error'
                    outline
                    onClick={() => setAudio(null)}
                />
            </div>
        </div>
    );
};
