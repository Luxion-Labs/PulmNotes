'use client'

import { useState } from 'react'
import { TipTapNoteEditor } from '@/editor'
import type { Note, Block } from '@/editor/schema/types'

export default function TipTapTestPage() {
  const [note, setNote] = useState<Note>({
    id: 'test-note-1',
    title: 'Converter Test Note',
    blocks: [
      { id: 'block-1', type: 'h1', content: '🎯 TipTap & Converter Test' },
      { id: 'block-2', type: 'text', content: 'Welcome to the converter test page! Try these features:' },
      { id: 'block-3', type: 'bullet-list', content: 'Type / for slash menu' },
      { id: 'block-4', type: 'bullet-list', content: 'Create mentions using @' },
      { id: 'block-5', type: 'bullet-list', content: 'Add lists, headings, code blocks' },
      { id: 'block-6', type: 'text', content: '' },
      { id: 'block-7', type: 'h2', content: 'How to test' },
      { id: 'block-8', type: 'numbered-list', content: 'Edit the note' },
      { id: 'block-9', type: 'numbered-list', content: 'Check the JSON panel below to see the Block[] structure' },
      { id: 'block-10', type: 'numbered-list', content: 'Open DevTools console (F12) to see logs' },
    ],
    categoryId: 'test-cat',
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  const handleUpdateBlocks = (noteId: string, blocks: Block[]) => {
    console.log('🔄 Converter executed!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('Updated blocks count:', blocks.length)
    console.log('Block types:', blocks.map(b => b.type).join(', '))
    console.log('Full blocks:', blocks)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    setNote(prev => ({ ...prev, blocks }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">TipTap Converter Test Suite</h1>
          <p className="text-slate-600">
            Test the Block ↔ TipTap JSON converters in real-time. See the live JSON output as you edit.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Editor Column (spans 2 cols on large screens) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                <h2 className="text-white font-semibold">✏️ TipTap Editor</h2>
                <p className="text-blue-100 text-sm mt-1">Type / for slash menu • Use @ for mentions</p>
              </div>
              <div className="p-6 min-h-96">
                <TipTapNoteEditor
                  note={note}
                  onUpdateBlocks={handleUpdateBlocks}
                />
              </div>
            </div>

            {/* Test Instructions */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">💡 Test scenarios:</h3>
              <ul className="text-sm text-blue-800 space-y-1 ml-4 list-disc">
                <li>Type <code className="bg-blue-100 px-2 py-1 rounded">/</code> to open slash menu → try each command</li>
                <li>Type <code className="bg-blue-100 px-2 py-1 rounded">@</code> followed by text to test mentions</li>
                <li>Mix different block types: headings, lists, code blocks, dividers</li>
                <li>Watch the JSON panel update in real-time (debounced 300ms)</li>
                <li>Open DevTools (F12) → Console tab to see detailed converter logs</li>
              </ul>
            </div>
          </div>

          {/* JSON Panel Column */}
          <div>
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden sticky top-6">
              <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
                <h2 className="text-white font-semibold">📊 Block[] JSON</h2>
                <p className="text-green-100 text-sm mt-1">Live converter output</p>
              </div>
              <div className="p-4">
                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                      Block Count
                    </p>
                    <p className="text-2xl font-bold text-slate-900">{note.blocks.length}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                      Block Types
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {Array.from(new Set(note.blocks.map(b => b.type))).map(type => (
                        <span
                          key={type}
                          className="inline-block bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-medium"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                    Full JSON
                  </p>
                  <pre className="bg-slate-50 p-3 rounded text-xs overflow-auto max-h-96 border border-slate-200">
                    {JSON.stringify(note.blocks, null, 2)}
                  </pre>
                </div>

                {/* Mentions indicator */}
                {note.blocks.some(b => b.mentions && b.mentions.length > 0) && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                      Mentions Detected
                    </p>
                    <div className="bg-orange-50 border border-orange-200 rounded p-2">
                      {note.blocks.map(block => (
                        block.mentions && block.mentions.length > 0 && (
                          <div key={block.id} className="text-xs text-orange-800 mb-1">
                            <span className="font-semibold">{block.id}:</span>{' '}
                            {block.mentions.map(m => m.title).join(', ')}
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* DevTools reminder */}
            <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm text-purple-900 font-semibold mb-2">📺 Debug info</p>
              <p className="text-xs text-purple-800">
                Open DevTools (<kbd className="bg-purple-100 px-1.5 py-0.5 rounded">F12</kbd>) → Console tab to see detailed converter logs with block updates.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-center text-sm text-slate-600">
            Testing converters: <code className="bg-slate-100 px-2 py-1 rounded">convertBlocksToTipTap()</code> ↔{' '}
            <code className="bg-slate-100 px-2 py-1 rounded">convertTipTapToBlocks()</code>
          </p>
        </div>
      </div>
    </div>
  )
}
