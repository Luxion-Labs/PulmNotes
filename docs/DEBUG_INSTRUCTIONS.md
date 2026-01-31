# 🔧 Debug Instructions - Rich Media Feature

## Current Status
✅ Dev server running at: http://localhost:3000  
✅ Build passes successfully  
✅ No TypeScript errors  

---

## 🎯 How to Test (Simple Version)

### 1. Open the App
Go to: **http://localhost:3000**

### 2. Open ANY Note
- Click on any note in the left sidebar
- OR create a new note

### 3. Look for the Button
**Bottom-right corner** - you should see a **dark circular button** with an eye icon 👁️

### 4. Add Test Content
Paste this into your note:
```
[Google](https://www.google.com)

https://picsum.photos/400/300
```

### 5. Click the Eye Button
The content should transform:
- "Google" becomes a blue clickable link
- The URL becomes an actual image

---

## 🐛 If You Don't See the Button

### Quick Check:
1. Press **F12** to open DevTools
2. Click **Console** tab
3. Paste this and press Enter:
```javascript
document.querySelector('button[title*="read mode"]')
```

**If it returns `null`:**
- The button isn't rendering
- There might be a component issue

**If it returns an HTML element:**
- The button exists but might be hidden
- Try scrolling or checking z-index

---

## 🔍 What "Not Working" Could Mean

Please tell me which scenario matches:

### Scenario A: "I don't see any button"
- [ ] I'm on the home screen (not in a note)
- [ ] I'm in a note but no button appears
- [ ] I see an error in the console

### Scenario B: "Button is there but nothing happens"
- [ ] Button exists but clicking does nothing
- [ ] Console shows an error when I click
- [ ] Page refreshes or something weird happens

### Scenario C: "I'm in read mode but content looks the same"
- [ ] Button changes to edit icon ✏️
- [ ] But links/images don't render
- [ ] Content still looks like plain text

### Scenario D: "Everything works but..."
- [ ] Images don't load
- [ ] Videos don't load
- [ ] Links don't open

---

## 📊 Quick Diagnostic

Run this in the browser console (F12 → Console):

```javascript
// Check if NoteView component is loaded
console.log('NoteView check:', window.location.href);

// Check if button exists
const button = document.querySelector('button[title*="read"]');
console.log('Button found:', button !== null);
console.log('Button element:', button);

// Check if we're in a note
const editor = document.querySelector('.max-w-3xl');
console.log('Editor found:', editor !== null);
```

**Copy the output and share it with me!**

---

## 🎬 Expected Flow

```
1. Open note
   ↓
2. See Eye button (bottom-right)
   ↓
3. Click Eye button
   ↓
4. View changes to read mode
   ↓
5. Button changes to Edit icon
   ↓
6. Rich content renders
   ↓
7. Click Edit button
   ↓
8. Back to edit mode
```

---

## 🚨 Common Issues & Fixes

### Issue: Button not visible
**Fix:** Add this to browser console:
```javascript
const btn = document.querySelector('button[title*="read"]');
if (btn) {
  btn.style.backgroundColor = 'red';
  btn.style.zIndex = '9999';
  console.log('Button highlighted in red!');
}
```

### Issue: Can't tell if I'm in read mode
**Fix:** Check the button icon:
- 👁️ Eye = Currently in EDIT mode (click to go to read)
- ✏️ Edit = Currently in READ mode (click to go to edit)

### Issue: Content not parsing
**Fix:** Test the parser:
```javascript
// In console
const testContent = "[Link](https://google.com)";
console.log('Testing:', testContent);
// Should show the markdown link
```

---

## 📝 Test Content Templates

### Template 1: Links Only
```
Check out [Google](https://www.google.com) and [GitHub](https://github.com)
```

### Template 2: Images Only
```
https://picsum.photos/500/300
https://picsum.photos/400/250
```

### Template 3: Videos Only
```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
https://vimeo.com/148751763
```

### Template 4: Everything
```
# Test Note

Link: [Click here](https://example.com)

Image:
https://picsum.photos/600/400

Video:
https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

---

## 💡 What to Share With Me

If it's still not working, please share:

1. **Which scenario** (A, B, C, or D) matches your issue
2. **Console output** from the diagnostic script above
3. **Screenshot** of what you see (if possible)
4. **Any error messages** from the console (F12)

This will help me identify the exact issue!

---

## ✅ Success Checklist

When it's working, you should be able to:
- [ ] See the Eye button in bottom-right
- [ ] Click it to switch to read mode
- [ ] See the button change to Edit icon
- [ ] See links become clickable and blue
- [ ] See images display inline
- [ ] See video load buttons
- [ ] Click Edit to return to edit mode
- [ ] Edit content normally

---

**The feature is implemented and builds successfully. If you're having issues, it's likely a visibility or interaction problem that we can debug together!**
