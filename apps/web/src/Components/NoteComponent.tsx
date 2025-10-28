import React from 'react';

const NoteComponent = ({ message }: { message: string }) => {
    return (
        <div className='p-3 text-xs text-blue-500 bg-blue-500/10'>
            <strong> NOTE:</strong> {message}
        </div>
    );
};

export default NoteComponent;
