"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { NotesService, Note } from '../../services/notesService';
import DOMPurify from 'dompurify';
import AuthGuard from '../../components/AuthGuard';
import { useAuth } from '../../contexts/AuthContext';

// Debounce function
function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  return useCallback(
    ((...args: any[]) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      const newTimeoutId = setTimeout(() => callback(...args), delay);
      setTimeoutId(newTimeoutId);
    }) as T,
    [callback, delay, timeoutId]
  );
}

export default function NotesPage() {
  const { user, loading: authLoading } = useAuth();
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const editorRef = useRef<HTMLDivElement>(null);

  // Auto-save function with debouncing
  const handleAutoSave = useDebounce(async (content: string) => {
    if (!user?.id) return;
    console.log('🔄 Auto-save triggered with content length:', content.length);
    if (!content.trim()) {
      console.log('⚠️ Content is empty, skipping save');
      return;
    }
    
    console.log('💾 Starting auto-save...');
    setSaveStatus('saving');
    
    // Save checkbox states before auto-saving
    saveCheckboxStates();
    
    try {
      console.log('📤 Calling NotesService.saveNote...');
      const savedNote = await NotesService.saveNote(user.id, content, currentNote?.id);
      console.log('📥 NotesService.saveNote response:', savedNote);
      
      if (savedNote) {
        setSaveStatus('saved');
        setCurrentNote(savedNote);
        console.log('✅ Note auto-saved successfully:', savedNote);
      } else {
        console.log('❌ NotesService.saveNote returned null');
        setSaveStatus('error');
      }
    } catch (error) {
      console.error('💥 Auto-save error:', error);
      setSaveStatus('error');
    }
  }, 2000); // 2 second delay

  // Handle content changes
  const handleContentChange = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      console.log('📝 Content changed, length:', content.length);
      handleAutoSave(content);
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = () => {
    console.log('☑️ Checkbox state changed');
    handleContentChange();
  };

  // Add event listener for checkbox changes
  useEffect(() => {
    const editor = editorRef.current;
    if (editor) {
      const handleCheckboxClick = (e: Event) => {
        const target = e.target as HTMLInputElement;
        if (target.type === 'checkbox') {
          console.log('☑️ Checkbox clicked:', target.checked);
          // Immediately update the HTML to reflect the new state
          if (target.checked) {
            target.setAttribute('checked', 'checked');
          } else {
            target.removeAttribute('checked');
          }
          // Small delay to ensure the checkbox state has updated
          setTimeout(() => {
            console.log('💾 Saving after checkbox change...');
            handleContentChange();
          }, 50);
        }
      };

      editor.addEventListener('click', handleCheckboxClick);
      return () => {
        editor.removeEventListener('click', handleCheckboxClick);
      };
    }
  }, [handleContentChange]);

  // Formatting functions
  const formatText = (command: string, value?: string) => {
    console.log('🎨 Formatting text:', command, value);
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleContentChange();
  };

  const insertCheckbox = () => {
    console.log('☐ Inserting checkbox');
    const checkbox = '<input type="checkbox" style="margin-right: 8px; vertical-align: middle;" /> <span contenteditable="true"></span><br>';
    document.execCommand('insertHTML', false, checkbox);
    editorRef.current?.focus();
    handleContentChange();
  };

  // Keyboard shortcuts handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Alt+1 for H1
    if (e.altKey && e.key === '1') {
      e.preventDefault();
      formatText('formatBlock', '<h1>');
    }
    // Alt+2 for H2
    if (e.altKey && e.key === '2') {
      e.preventDefault();
      formatText('formatBlock', '<h2>');
    }
    // Alt+3 for Checkbox
    if (e.altKey && e.key === '3') {
      e.preventDefault();
      insertCheckbox();
    }
  };

  // Load the most recent note on component mount
  useEffect(() => {
    if (!user?.id || authLoading) return;
    console.log('🚀 NotesPage mounted, loading notes...');
    loadMostRecentNote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, authLoading]);

  // Load the most recent note
  const loadMostRecentNote = async () => {
    if (!user?.id) return;
    try {
      console.log('📂 Loading most recent note...');
      setIsLoading(true);
      const notes = await NotesService.loadNotes(user.id);
      console.log('📋 Notes loaded:', notes);
      
      if (notes.length > 0) {
        const mostRecentNote = notes[0];
        console.log('📄 Setting most recent note:', mostRecentNote);
        setCurrentNote(mostRecentNote);
        if (editorRef.current) {
          // Sanitize the HTML content before rendering
          const sanitizedContent = DOMPurify.sanitize(mostRecentNote.content || '');
          editorRef.current.innerHTML = sanitizedContent;
          // Restore checkbox states after setting innerHTML
          restoreCheckboxStates();
          console.log('📝 Set editor content:', mostRecentNote.content);
        }
      } else {
        console.log('🆕 No notes found, creating new note...');
        // Create a new note if none exist
        const newNote = await NotesService.saveNote(user.id, '', undefined);
        console.log('🆕 New note created:', newNote);
        if (newNote) {
          setCurrentNote(newNote);
          if (editorRef.current) {
            editorRef.current.innerHTML = '';
          }
        }
      }
    } catch (error) {
      console.error('💥 Error loading note:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Restore checkbox states from saved content
  const restoreCheckboxStates = () => {
    if (!editorRef.current) return;
    
    const checkboxes = editorRef.current.querySelectorAll('input[type="checkbox"]');
    console.log('🔍 Found checkboxes to restore:', checkboxes.length);
    checkboxes.forEach((checkbox) => {
      const input = checkbox as HTMLInputElement;
      console.log('📝 Restoring checkbox, has checked attribute:', input.hasAttribute('checked'));
      // Restore the checked state from the saved HTML
      if (input.hasAttribute('checked')) {
        input.checked = true;
        console.log('✅ Restored as checked');
      } else {
        input.checked = false;
        console.log('❌ Restored as unchecked');
      }
    });
  };

  // Save checkbox states before saving content
  const saveCheckboxStates = () => {
    if (!editorRef.current) return;
    
    const checkboxes = editorRef.current.querySelectorAll('input[type="checkbox"]');
    console.log('🔍 Found checkboxes to save:', checkboxes.length);
    checkboxes.forEach((checkbox) => {
      const input = checkbox as HTMLInputElement;
      console.log('📝 Saving checkbox state:', input.checked);
      // Ensure the checked state is properly reflected in the HTML
      if (input.checked) {
        input.setAttribute('checked', 'checked');
        console.log('✅ Set checked attribute');
      } else {
        input.removeAttribute('checked');
        console.log('❌ Removed checked attribute');
      }
    });
  };

  // Manual save function
  const handleManualSave = async () => {
    if (!editorRef.current || !user?.id) {
      console.log('❌ No editor ref or user ID');
      return;
    }
    
    saveCheckboxStates();
    const content = editorRef.current.innerHTML;
    console.log('💾 Manual save triggered, content length:', content.length);
    
    setSaveStatus('saving');
    try {
      console.log('📤 Calling NotesService.saveNote for manual save...');
      const savedNote = await NotesService.saveNote(user.id, content, currentNote?.id);
      console.log('📥 Manual save response:', savedNote);
      
      if (savedNote) {
        setSaveStatus('saved');
        setCurrentNote(savedNote);
        console.log('✅ Note saved successfully:', savedNote);
      } else {
        console.log('❌ Manual save returned null');
        setSaveStatus('error');
      }
    } catch (error) {
      console.error('💥 Manual save error:', error);
      setSaveStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Notes</h1>
          <div className="flex items-center gap-4">
            {isLoading && (
              <span className="text-sm text-gray-500">Loading...</span>
            )}
            {!isLoading && (
              <>
                <span className={`text-sm ${
                  saveStatus === 'saved' ? 'text-green-600' : 
                  saveStatus === 'saving' ? 'text-yellow-600' : 
                  'text-red-600'
                }`}>
                  {saveStatus === 'saved' && '✓ Saved'}
                  {saveStatus === 'saving' && 'Saving...'}
                  {saveStatus === 'error' && '✗ Error saving'}
                </span>
                <button
                  onClick={handleManualSave}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
                >
                  Save
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Instructions */}
      <div className="mb-2 text-sm text-gray-500">
        <strong>Shortcuts:</strong> <br />
        <span><kbd>Alt</kbd> + <kbd>1</kbd> = H1,&nbsp; </span>
        <span><kbd>Alt</kbd> + <kbd>2</kbd> = H2,&nbsp; </span>
        <span><kbd>Alt</kbd> + <kbd>3</kbd> = Checkbox</span>
      </div>

      {/* Formatting Toolbar - ONLY H1, H2, Bold, Checkbox */}
      <div className="mb-4 flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border">
        <button
          onClick={() => formatText('formatBlock', '<h1>')}
          className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
          title="Heading 1 (Alt+1)"
        >
          H1
        </button>
        <button
          onClick={() => formatText('formatBlock', '<h2>')}
          className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
          title="Heading 2 (Alt+2)"
        >
          H2
        </button>
        <button
          onClick={() => formatText('bold')}
          className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={insertCheckbox}
          className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
          title="Checkbox (Alt+3)"
        >
          ☐
        </button>
      </div>

      {/* Rich Text Editor */}
      <div className="bg-white border border-gray-300 rounded-lg shadow-sm">
        <div
          ref={editorRef}
          className="min-h-[320px] sm:min-h-[500px] p-4 sm:p-6 focus:outline-none text-gray-900 leading-relaxed"
          contentEditable
          onInput={handleContentChange}
          onKeyDown={handleKeyDown}
          onBlur={handleContentChange}
          style={{ 
            fontSize: '16px',
            lineHeight: '1.6'
          }}
        />
      </div>
      </div>
    </div>
  );
} 