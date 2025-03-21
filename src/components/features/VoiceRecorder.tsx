'use client';

import React, { useState, useRef } from 'react';
import { MicrophoneIcon } from '@heroicons/react/24/solid';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob, transcript: string) => void;
}

export function VoiceRecorder({ onRecordingComplete }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);

  // Instead of using state for transcript, use a ref for synchronous updates
  const transcriptRef = useRef('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const recorderStoppedRef = useRef(false);
  const recognitionStoppedRef = useRef(false);

  const tryFinishRecording = (audioBlob: Blob) => {
    if (recorderStoppedRef.current && recognitionStoppedRef.current) {
      // Use transcriptRef.current to get the *immediately* updated transcript
      const finalTranscript = transcriptRef.current.trim();
      console.log('Final transcript:', finalTranscript);

      onRecordingComplete(audioBlob, finalTranscript);

      // Reset everything
      recorderStoppedRef.current = false;
      recognitionStoppedRef.current = false;
      transcriptRef.current = '';
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      recorderStoppedRef.current = false;
      recognitionStoppedRef.current = false;
      transcriptRef.current = ''; // Reset before starting

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        recorderStoppedRef.current = true;
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        // Small delay so onresult has time to finalize
        setTimeout(() => {
          tryFinishRecording(audioBlob);
        }, 200);
      };

      mediaRecorder.start();

      // Initialize SpeechRecognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'ar-SA';
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
          let finalTranscript = transcriptRef.current;
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              console.log('Interim result:', event.results[i][0].transcript);
            }
          }
          transcriptRef.current = finalTranscript;
          console.log('onresult finalTranscript so far:', transcriptRef.current);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
        };

        recognition.onend = () => {
          recognitionStoppedRef.current = true;
          setTimeout(() => {
            if (mediaRecorderRef.current?.state === 'inactive') {
              // If recorder already stopped, finalize
              const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
              tryFinishRecording(audioBlob);
            }
          }, 100);
        };

        recognition.start();
        recognitionRef.current = recognition;
      } else {
        console.error('SpeechRecognition API not supported in this browser.');
        recognitionStoppedRef.current = true;
      }

      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    } else {
      recognitionStoppedRef.current = true;
    }
    setIsRecording(false);
  };

  return (
    <button
      type="button"
      onClick={isRecording ? stopRecording : startRecording}
      className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
      title={isRecording ? 'Stop recording' : 'Record voice message'}
    >
      <MicrophoneIcon className="h-6 w-6 text-gray-700" />
    </button>
  );
}
