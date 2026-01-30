'use client';

import React, { useState } from 'react';
import { Category, SubCategory, Note, ViewMode, Asset } from '@/app/types';
import { FileText, Plus, FolderPlus, Home, Clock, Pin, Library, Settings, Trash2, Search, Folder, BookOpen, Briefcase, Heart, Star, Lightbulb, Coffee, Music, MessageSquare, File, Link as LinkIcon, Image, FileCode } from 'lucide-react';
import { NoteContextMenu } from './NoteContextMenu';
import { CategoryContextMenu } from './CategoryContextMenu';
import { SubCategoryContextMenu } from './SubCategoryContextMenu';
import { CategoryModal } from './CategoryModal';
import { SubCategoryModal } from './SubCategoryModal';
import { AssetContextMenu } from './AssetContextMenu';

interface SidebarProps {
  viewMode: ViewMode;
  categories: Category[];
  subCategories: SubCategory[];
  notes: Note[];
  assets: Asset[];
  currentNoteId: string | null;
  selectedCategoryId: string | null;
  selectedSubCategoryId: string | null;
  onSelectNote: (noteId: string) => void;
  onSelectCategory: (categoryId: string) => void;
  onSelectSubCategory: (subCategoryId: string) => void;
  onCreateCategory: (name: string, color: string, icon?: string) => void;
  onUpdateCategory: (categoryId: string, name: string, color: string, icon?: string) => void;
  onCreateSubCategory: (categoryId: string, name: string, icon?: string) => void;
  onUpdateSubCategory: (subCategoryId: string, name: string, icon?: string) => void;
  onCreateNote: (categoryId: string, subCategoryId?: string) => void;
  onChangeView: (mode: ViewMode) => void;
  onDeleteNote: (noteId: string) => void;
  onDeleteCategory: (categoryId: string) => void;
  onDeleteSubCategory: (subCategoryId: string) => void;
  onTogglePin: (noteId: string) => void;
  onMoveNote: (noteId: string, targetCategoryId: string, targetSubCategoryId?: string) => void;
  onMoveAsset: (assetId: string, targetCategoryId: string, targetSubCategoryId?: string) => void;
  onOpenFeedback: () => void;
  onOpenAsset: (assetId: string) => void;
  onDeleteAsset: (assetId: string) => void;
  onOpenAssetModal: (categoryId: string, subCategoryId?: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  viewMode,
  categories,
  subCategories,
  notes,
  assets,
  currentNoteId, 
  selectedCategoryId,
  selectedSubCategoryId,
  onSelectNote,
  onSelectCategory,
  onSelectSubCategory,
  onCreateCategory,
  onUpdateCategory,
  onCreateSubCategory,
  onUpdateSubCategory,
  onCreateNote,
  onChangeView,
  onDeleteNote,
  onDeleteCategory,
  onDeleteSubCategory,
  onTogglePin,
  onMoveNote,
  onMoveAsset,
  onOpenFeedback,
  onOpenAsset,
  onDeleteAsset,
  onOpenAssetModal
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(categories.map(c => c.id)));
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryModalMode, setCategoryModalMode] = useState<'create' | 'edit'>('create');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);
  const [subCategoryModalMode, setSubCategoryModalMode] = useState<'create' | 'edit'>('create');
  const [editingSubCategoryId, setEditingSubCategoryId] = useState<string | null>(null);
  const [selectedCategoryForSubCategory, setSelectedCategoryForSubCategory] = useState<string | null>(null);
  const [isHoveringSettings, setIsHoveringSettings] = useState(false);
  const [dragOverTarget, setDragOverTarget] = useState<{ type: 'category' | 'subcategory', id: string } | null>(null);
  const [noteContextMenu, setNoteContextMenu] = useState<{
    x: number;
    y: number;
    noteId: string;
  } | null>(null);
  const [categoryContextMenu, setCategoryContextMenu] = useState<{
    x: number;
    y: number;
    categoryId: string;
  } | null>(null);
  const [subCategoryContextMenu, setSubCategoryContextMenu] = useState<{
    x: number;
    y: number;
    subCategoryId: string;
  } | null>(null);
  const [assetContextMenu, setAssetContextMenu] = useState<{
    x: number;
    y: number;
    assetId: string;
  } | null>(null);

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const getNotesForCategory = (categoryId: string, subCategoryId?: string) => {
    return notes.filter(note => 
      note.categoryId === categoryId && 
      !note.isDeleted &&
      (subCategoryId ? note.subCategoryId === subCategoryId : !note.subCategoryId)
    );
  };

  const getAssetsForCategory = (categoryId: string, subCategoryId?: string) => {
    return assets.filter(asset => 
      asset.categoryId === categoryId && 
      !asset.isDeleted &&
      (subCategoryId ? asset.subCategoryId === subCategoryId : !asset.subCategoryId)
    );
  };

  const getSubCategoriesForCategory = (categoryId: string) => {
    return subCategories.filter(sc => sc.categoryId === categoryId);
  };

  const handleNoteContextMenu = (e: React.MouseEvent, noteId: string) => {
    e.preventDefault();
    e.stopPropagation();
    // Close other menus
    setCategoryContextMenu(null);
    setSubCategoryContextMenu(null);
    setAssetContextMenu(null);
    setNoteContextMenu({
      x: e.clientX,
      y: e.clientY,
      noteId
    });
  };

  const handleCategoryContextMenu = (e: React.MouseEvent, categoryId: string) => {
    e.preventDefault();
    e.stopPropagation();
    // Close other menus
    setNoteContextMenu(null);
    setSubCategoryContextMenu(null);
    setAssetContextMenu(null);
    setCategoryContextMenu({
      x: e.clientX,
      y: e.clientY,
      categoryId
    });
  };

  const handleSubCategoryContextMenu = (e: React.MouseEvent, subCategoryId: string) => {
    e.preventDefault();
    e.stopPropagation();
    // Close other menus
    setNoteContextMenu(null);
    setCategoryContextMenu(null);
    setAssetContextMenu(null);
    setSubCategoryContextMenu({
      x: e.clientX,
      y: e.clientY,
      subCategoryId
    });
  };

  const handleAssetContextMenu = (e: React.MouseEvent, assetId: string) => {
    e.preventDefault();
    e.stopPropagation();
    // Close other menus
    setNoteContextMenu(null);
    setCategoryContextMenu(null);
    setSubCategoryContextMenu(null);
    setAssetContextMenu({
      x: e.clientX,
      y: e.clientY,
      assetId
    });
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'pdf':
      case 'docx':
        return File;
      case 'link':
        return LinkIcon;
      case 'image':
        return Image;
      case 'markdown':
      case 'text':
        return FileCode;
      default:
        return File;
    }
  };

  const canDeleteCategory = (categoryId: string): boolean => {
    const categoryNotes = notes.filter(n => n.categoryId === categoryId && !n.isDeleted);
    return categoryNotes.length === 0;
  };

  const canDeleteSubCategory = (subCategoryId: string): boolean => {
    const subCategoryNotes = notes.filter(n => n.subCategoryId === subCategoryId && !n.isDeleted);
    return subCategoryNotes.length === 0;
  };

  const handleSaveCategory = (name: string, color: string, icon?: string) => {
    if (categoryModalMode === 'edit' && editingCategoryId) {
      onUpdateCategory(editingCategoryId, name, color, icon);
      setEditingCategoryId(null);
    } else {
      onCreateCategory(name, color, icon);
    }
  };

  const handleOpenCategoryEditModal = (categoryId: string) => {
    setEditingCategoryId(categoryId);
    setCategoryModalMode('edit');
    setIsCategoryModalOpen(true);
  };

  const handleOpenCategoryCreateModal = () => {
    setEditingCategoryId(null);
    setCategoryModalMode('create');
    setIsCategoryModalOpen(true);
  };

  const handleOpenSubCategoryModal = (categoryId: string) => {
    setSelectedCategoryForSubCategory(categoryId);
    setEditingSubCategoryId(null);
    setSubCategoryModalMode('create');
    setIsSubCategoryModalOpen(true);
  };

  const handleOpenSubCategoryEditModal = (subCategoryId: string) => {
    const subCategory = subCategories.find(sc => sc.id === subCategoryId);
    if (subCategory) {
      setSelectedCategoryForSubCategory(subCategory.categoryId);
      setEditingSubCategoryId(subCategoryId);
      setSubCategoryModalMode('edit');
      setIsSubCategoryModalOpen(true);
    }
  };

  const handleSaveSubCategory = (name: string, icon?: string) => {
    if (subCategoryModalMode === 'edit' && editingSubCategoryId) {
      onUpdateSubCategory(editingSubCategoryId, name, icon);
      setEditingSubCategoryId(null);
    } else if (selectedCategoryForSubCategory) {
      onCreateSubCategory(selectedCategoryForSubCategory, name, icon);
    }
  };

  const handleDragStart = (e: React.DragEvent, noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note?.isDeleted) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', noteId);
    e.dataTransfer.setData('itemType', 'note');
  };

  const handleAssetDragStart = (e: React.DragEvent, assetId: string) => {
    const asset = assets.find(a => a.id === assetId);
    if (asset?.isDeleted) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', assetId);
    e.dataTransfer.setData('itemType', 'asset');
  };

  const handleDragOver = (e: React.DragEvent, targetType: 'category' | 'subcategory', targetId: string) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setDragOverTarget({ type: targetType, id: targetId });
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverTarget(null);
  };

  const handleDrop = (e: React.DragEvent, targetCategoryId: string, targetSubCategoryId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const itemId = e.dataTransfer.getData('text/plain');
    const itemType = e.dataTransfer.getData('itemType');
    
    if (itemType === 'asset') {
      const asset = assets.find(a => a.id === itemId);
      
      if (!asset || asset.isDeleted) {
        setDragOverTarget(null);
        return;
      }

      // Check if dropping on same location
      const isSameLocation = asset.categoryId === targetCategoryId && 
                            asset.subCategoryId === targetSubCategoryId;
      
      if (!isSameLocation) {
        // Validate target sub-category belongs to target category
        if (targetSubCategoryId) {
          const subCategory = subCategories.find(sc => sc.id === targetSubCategoryId);
          if (!subCategory || subCategory.categoryId !== targetCategoryId) {
            setDragOverTarget(null);
            return;
          }
        }
        
        onMoveAsset(itemId, targetCategoryId, targetSubCategoryId);
      }
    } else {
      // Handle note drag (existing logic)
      const note = notes.find(n => n.id === itemId);
      
      if (!note || note.isDeleted) {
        setDragOverTarget(null);
        return;
      }

      // Check if dropping on same location
      const isSameLocation = note.categoryId === targetCategoryId && 
                            note.subCategoryId === targetSubCategoryId;
      
      if (!isSameLocation) {
        // Validate target sub-category belongs to target category
        if (targetSubCategoryId) {
          const subCategory = subCategories.find(sc => sc.id === targetSubCategoryId);
          if (!subCategory || subCategory.categoryId !== targetCategoryId) {
            setDragOverTarget(null);
            return;
          }
        }
        
        onMoveNote(itemId, targetCategoryId, targetSubCategoryId);
      }
    }
    
    setDragOverTarget(null);
  };

  const getIconComponent = (iconId?: string, withBackground: boolean = true) => {
    if (!iconId) return null;
    const iconMap: Record<string, any> = {
      folder: Folder,
      book: BookOpen,
      briefcase: Briefcase,
      heart: Heart,
      star: Star,
      lightbulb: Lightbulb,
      coffee: Coffee,
      music: Music,
    };
    const Icon = iconMap[iconId];
    if (!Icon) return null;
    
    if (withBackground) {
      return <Icon size={12} className="text-white" />;
    }
    return <Icon size={11} className="text-stone-500" />;
  };

  return (
    <div className="w-64 h-screen bg-stone-100 flex flex-col border-r border-stone-200">
      <div className="p-4 space-y-1">
        <button
          onClick={() => onChangeView('home')}
          className={`flex items-center gap-2 w-full px-2 py-1.5 rounded text-sm font-medium transition-colors $
{
            viewMode === 'home' 
              ? 'bg-stone-200 text-stone-900' 
              : 'text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Home size={16} />
          <span>All Notes</span>
        </button>
        
        <button
          onClick={() => onChangeView('recent')}
          className={`flex items-center gap-2 w-full px-2 py-1.5 rounded text-sm font-medium transition-colors ${
            viewMode === 'recent' 
              ? 'bg-stone-200 text-stone-900' 
              : 'text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Clock size={16} />
          <span>Recent</span>
        </button>
        
        <button
          onClick={() => onChangeView('pins')}
          className={`flex items-center gap-2 w-full px-2 py-1.5 rounded text-sm font-medium transition-colors ${
            viewMode === 'pins' 
              ? 'bg-stone-200 text-stone-900' 
              : 'text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Pin size={16} />
          <span>Pins</span>
        </button>
        
        <button
          onClick={() => onChangeView('library')}
          className={`flex items-center gap-2 w-full px-2 py-1.5 rounded text-sm font-medium transition-colors ${
            viewMode === 'library' 
              ? 'bg-stone-200 text-stone-900' 
              : 'text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Library size={16} />
          <span>Library</span>
        </button>
      </div>

      {viewMode === 'library' && (
        <>
          <div className="px-4 pt-2 pb-3">
            <button
              onClick={handleOpenCategoryCreateModal}
              className="flex items-center gap-2 text-stone-600 text-sm font-medium px-2 py-1.5 hover:bg-stone-200 rounded cursor-pointer w-full transition-colors"
            >
              <FolderPlus size={16} />
              <span>New category</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <div className="space-y-0.5">
              {categories.map((category) => {
                const isCategoryExpanded = expandedCategories.has(category.id);
                const categoryNotes = getNotesForCategory(category.id);
                const categorySubCategories = getSubCategoriesForCategory(category.id);
                const isSelected = selectedCategoryId === category.id && !selectedSubCategoryId;
                
                return (
                  <div key={category.id}>
                    <div 
                      className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer group transition-colors ${
                        isSelected ? 'bg-stone-200' : 'hover:bg-stone-200'
                      } ${
                        dragOverTarget?.type === 'category' && dragOverTarget.id === category.id 
                          ? 'bg-stone-200 ring-1 ring-stone-300' 
                          : ''
                      }`}
                      onClick={() => {
                        toggleCategory(category.id);
                        onSelectCategory(category.id);
                      }}
                      onContextMenu={(e) => handleCategoryContextMenu(e, category.id)}
                      onDragOver={(e) => handleDragOver(e, 'category', category.id)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, category.id)}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div 
                          className="w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center" 
                          style={{ backgroundColor: category.color }}
                        >
                          {getIconComponent(category.icon)}
                        </div>
                        <span className="text-stone-700 text-sm font-medium truncate">
                          {category.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-stone-400 flex-shrink-0">
                          {categoryNotes.length}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onCreateNote(category.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-stone-300 rounded transition-opacity"
                          title="New note"
                        >
                          <Plus size={14} className="text-stone-600" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenAssetModal(category.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-stone-300 rounded transition-opacity"
                          title="Add asset"
                        >
                          <File size={14} className="text-stone-600" />
                        </button>
                      </div>
                    </div>

                    {isCategoryExpanded && (
                      <div className="ml-6 space-y-0.5 mt-0.5">
                        {categoryNotes.map((note) => (
                          <div
                            key={note.id}
                            className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors ${
                              currentNoteId === note.id
                                ? 'bg-stone-300 text-stone-900'
                                : 'hover:bg-stone-200 text-stone-600'
                            }`}
                            draggable
                            onDragStart={(e) => handleDragStart(e, note.id)}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectNote(note.id);
                            }}
                            onContextMenu={(e) => handleNoteContextMenu(e, note.id)}
                          >
                            <FileText size={13} className="flex-shrink-0" />
                            <span className="text-xs truncate">{note.title}</span>
                            {note.isPinned && (
                              <Pin size={10} className="flex-shrink-0 text-stone-400 ml-auto" />
                            )}
                          </div>
                        ))}

                        {getAssetsForCategory(category.id).map((asset) => {
                          const AssetIcon = getAssetIcon(asset.type);
                          return (
                            <div
                              key={asset.id}
                              className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors hover:bg-stone-200 text-stone-500 group"
                              draggable
                              onDragStart={(e) => handleAssetDragStart(e, asset.id)}
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenAsset(asset.id);
                              }}
                              onContextMenu={(e) => handleAssetContextMenu(e, asset.id)}
                            >
                              <AssetIcon size={11} className="flex-shrink-0" />
                              <span className="text-[11px] truncate">{asset.name}</span>
                            </div>
                          );
                        })}

                        {categorySubCategories.map((subCategory) => {
                          const subCategoryNotes = getNotesForCategory(category.id, subCategory.id);
                          const subCategoryAssets = getAssetsForCategory(category.id, subCategory.id);
                          const isSubSelected = selectedSubCategoryId === subCategory.id;

                          return (
                            <div key={subCategory.id} className="space-y-0.5">
                              <div
                                className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer group transition-colors ${
                                  isSubSelected ? 'bg-stone-200' : 'hover:bg-stone-200'
                                } ${
                                  dragOverTarget?.type === 'subcategory' && dragOverTarget.id === subCategory.id 
                                    ? 'bg-stone-200 ring-1 ring-stone-300' 
                                    : ''
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectSubCategory(subCategory.id);
                                }}
                                onContextMenu={(e) => handleSubCategoryContextMenu(e, subCategory.id)}
                                onDragOver={(e) => handleDragOver(e, 'subcategory', subCategory.id)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, category.id, subCategory.id)}
                              >
                                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                  {subCategory.icon && (
                                    <div className="flex-shrink-0">
                                      {getIconComponent(subCategory.icon, false)}
                                    </div>
                                  )}
                                  <span className="text-stone-600 text-xs font-medium truncate">
                                    {subCategory.name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-xs text-stone-400 flex-shrink-0">
                                    {subCategoryNotes.length}
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onCreateNote(category.id, subCategory.id);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-stone-300 rounded transition-opacity"
                                    title="New note"
                                  >
                                    <Plus size={12} className="text-stone-600" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onOpenAssetModal(category.id, subCategory.id);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-stone-300 rounded transition-opacity"
                                    title="Add asset"
                                  >
                                    <File size={12} className="text-stone-600" />
                                  </button>
                                </div>
                              </div>

                              {subCategoryNotes.map((note) => (
                                <div
                                  key={note.id}
                                  className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer ml-4 transition-colors ${
                                    currentNoteId === note.id
                                      ? 'bg-stone-300 text-stone-900'
                                      : 'hover:bg-stone-200 text-stone-600'
                                  }`}
                                  draggable
                                  onDragStart={(e) => handleDragStart(e, note.id)}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectNote(note.id);
                                  }}
                                  onContextMenu={(e) => handleNoteContextMenu(e, note.id)}
                                >
                                  <FileText size={12} className="flex-shrink-0" />
                                  <span className="text-xs truncate">{note.title}</span>
                                  {note.isPinned && (
                                    <Pin size={9} className="flex-shrink-0 text-stone-400 ml-auto" />
                                  )}
                                </div>
                              ))}

                              {subCategoryAssets.map((asset) => {
                                const AssetIcon = getAssetIcon(asset.type);
                                return (
                                  <div
                                    key={asset.id}
                                    className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer ml-4 transition-colors hover:bg-stone-200 text-stone-500"
                                    draggable
                                    onDragStart={(e) => handleAssetDragStart(e, asset.id)}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onOpenAsset(asset.id);
                                    }}
                                    onContextMenu={(e) => handleAssetContextMenu(e, asset.id)}
                                  >
                                    <AssetIcon size={10} className="flex-shrink-0" />
                                    <span className="text-[11px] truncate">{asset.name}</span>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenSubCategoryModal(category.id);
                          }}
                          className="flex items-center gap-1.5 px-2 py-1 text-xs text-stone-500 hover:text-stone-700 hover:bg-stone-200 rounded w-full transition-colors"
                        >
                          <Plus size={12} />
                          <span>Add sub-category</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {viewMode !== 'library' && (
        <div className="flex-1" />
      )}

      <div 
        className="p-4 mt-auto border-t border-stone-200"
        onMouseEnter={() => setIsHoveringSettings(true)}
        onMouseLeave={() => setIsHoveringSettings(false)}
      >
        {isHoveringSettings && (
          <div className="space-y-1 mb-1">
            <button
              onClick={() => onChangeView('search')}
              className={`flex items-center gap-2 w-full px-2 py-1.5 rounded text-sm font-medium transition-colors ${
                viewMode === 'search' 
                  ? 'bg-stone-200 text-stone-900' 
                  : 'text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Search size={16} />
              <span>Search</span>
            </button>
            
            <button
              onClick={onOpenFeedback}
              className="flex items-center gap-2 w-full px-2 py-1.5 rounded text-sm font-medium transition-colors text-stone-600 hover:bg-stone-200"
            >
              <MessageSquare size={16} />
              <span>Feedback</span>
            </button>
            
            <button
              onClick={() => onChangeView('bin')}
              className={`flex items-center gap-2 w-full px-2 py-1.5 rounded text-sm font-medium transition-colors ${
                viewMode === 'bin' 
                  ? 'bg-stone-200 text-stone-900' 
                  : 'text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Trash2 size={16} />
              <span>Bin</span>
            </button>
          </div>
        )}
        
        <button
          onClick={() => onChangeView('settings')}
          className={`flex items-center gap-2 w-full px-2 py-1.5 rounded text-sm font-medium transition-colors ${
            viewMode === 'settings' 
              ? 'bg-stone-200 text-stone-900' 
              : 'text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Settings size={16} />
          <span>Settings</span>
        </button>
      </div>

      {noteContextMenu && (
        <NoteContextMenu
          x={noteContextMenu.x}
          y={noteContextMenu.y}
          isPinned={notes.find(n => n.id === noteContextMenu.noteId)?.isPinned}
          onOpen={() => {
            onSelectNote(noteContextMenu.noteId);
            setNoteContextMenu(null);
          }}
          onDelete={() => {
            onDeleteNote(noteContextMenu.noteId);
            setNoteContextMenu(null);
          }}
          onTogglePin={() => {
            onTogglePin(noteContextMenu.noteId);
            setNoteContextMenu(null);
          }}
          onClose={() => setNoteContextMenu(null)}
        />
      )}

      {categoryContextMenu && (
        <CategoryContextMenu
          x={categoryContextMenu.x}
          y={categoryContextMenu.y}
          canDelete={canDeleteCategory(categoryContextMenu.categoryId)}
          onEdit={() => handleOpenCategoryEditModal(categoryContextMenu.categoryId)}
          onDelete={() => {
            onDeleteCategory(categoryContextMenu.categoryId);
            setCategoryContextMenu(null);
          }}
          onClose={() => setCategoryContextMenu(null)}
        />
      )}

      {subCategoryContextMenu && (
        <SubCategoryContextMenu
          x={subCategoryContextMenu.x}
          y={subCategoryContextMenu.y}
          canDelete={canDeleteSubCategory(subCategoryContextMenu.subCategoryId)}
          onRename={() => handleOpenSubCategoryEditModal(subCategoryContextMenu.subCategoryId)}
          onDelete={() => {
            onDeleteSubCategory(subCategoryContextMenu.subCategoryId);
            setSubCategoryContextMenu(null);
          }}
          onClose={() => setSubCategoryContextMenu(null)}
        />
      )}

      {assetContextMenu && (
        <AssetContextMenu
          x={assetContextMenu.x}
          y={assetContextMenu.y}
          onOpen={() => {
            onOpenAsset(assetContextMenu.assetId);
            setAssetContextMenu(null);
          }}
          onDelete={() => {
            onDeleteAsset(assetContextMenu.assetId);
            setAssetContextMenu(null);
          }}
          onClose={() => setAssetContextMenu(null)}
        />
      )}

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setEditingCategoryId(null);
        }}
        onSave={handleSaveCategory}
        initialData={editingCategoryId ? categories.find(c => c.id === editingCategoryId) : undefined}
        mode={categoryModalMode}
      />

      <SubCategoryModal
        isOpen={isSubCategoryModalOpen}
        categoryName={categories.find(c => c.id === selectedCategoryForSubCategory)?.name || ''}
        onClose={() => {
          setIsSubCategoryModalOpen(false);
          setSelectedCategoryForSubCategory(null);
          setEditingSubCategoryId(null);
        }}
        onSave={handleSaveSubCategory}
        initialData={editingSubCategoryId ? subCategories.find(sc => sc.id === editingSubCategoryId) : undefined}
        mode={subCategoryModalMode}
      />
    </div>
  );
};
