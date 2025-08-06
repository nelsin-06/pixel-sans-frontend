# Ezoic Ads Integration Guide

## What Has Been Done

✅ **Header Scripts Added** - The following scripts have been added to all HTML pages:

1. **Privacy Scripts** (loaded first for compliance):
   ```html
   <script src="https://cmp.gatekeeperconsent.com/min.js" data-cfasync="false"></script>
   <script src="https://the.gatekeeperconsent.com/cmp.min.js" data-cfasync="false"></script>
   ```

2. **Ezoic Header Script**:
   ```html
   <script async src="//www.ezojs.com/ezoic/sa.min.js"></script>
   <script>
       window.ezstandalone = window.ezstandalone || {};
       ezstandalone.cmd = ezstandalone.cmd || [];
   </script>
   ```

## Files Updated

The following HTML files have been updated with Ezoic scripts:
- ✅ `index.html`
- ✅ `category.html`
- ✅ `post-detail.html`
- ✅ `contacto.html`
- ✅ `politica-privacidad.html`
- ✅ `aviso-legal.html`
- ✅ `terminos-condiciones.html`

## Next Steps

### Step 1: Verify Integration
1. Visit your website and check that it loads normally
2. Open browser developer tools and ensure no JavaScript errors
3. Look for Ezoic scripts loading in the Network tab

### Step 2: Set up ads.txt
You'll need to add Ezoic entries to your `ads.txt` file. Ezoic will provide you with the specific entries needed.

### Step 3: Add Ad Placements (Optional)
You can add specific ad placements using JavaScript. Here are some examples:

#### Example Ad Placements

**Header Banner Ad:**
```html
<div id="ezoic-header-ad"></div>
<script>
ezstandalone.cmd.push(function() {
    ezstandalone.define('header-ad', {
        id: 'ezoic-header-ad',
        size: [[728, 90], [320, 50]],
        responsive: true
    });
});
</script>
```

**Sidebar Ad:**
```html
<div id="ezoic-sidebar-ad"></div>
<script>
ezstandalone.cmd.push(function() {
    ezstandalone.define('sidebar-ad', {
        id: 'ezoic-sidebar-ad',
        size: [[300, 250], [300, 600]],
        responsive: true
    });
});
</script>
```

**In-Content Ad:**
```html
<div id="ezoic-content-ad"></div>
<script>
ezstandalone.cmd.push(function() {
    ezstandalone.define('content-ad', {
        id: 'ezoic-content-ad',
        size: [[336, 280], [300, 250]],
        responsive: true
    });
});
</script>
```

### Step 4: Test and Monitor
1. Test your website on different devices
2. Monitor ad performance in Ezoic dashboard
3. Check for any conflicts with existing Google AdSense

## Important Notes

- ⚠️ **Privacy Compliance**: The privacy scripts handle GDPR/CCPA compliance
- ⚠️ **Load Order**: Privacy scripts must load before the main Ezoic script
- ⚠️ **AdSense Compatibility**: Ezoic can work alongside Google AdSense
- ⚠️ **Performance**: Monitor page load times after integration

## Troubleshooting

If you experience issues:
1. Check browser console for JavaScript errors
2. Verify all scripts are loading properly
3. Ensure no ad blockers are interfering
4. Contact Ezoic support if needed

## Ad Revenue Optimization

Once integrated, Ezoic will:
- Automatically optimize ad placements
- Test different ad sizes and positions
- Provide analytics and reporting
- Handle header bidding and yield optimization
