# macOS Stage Manager Reference

Source: Apple Mac User Guide, "Organise your Mac desktop with Stage Manager"

## Takeaways

- Stage Manager keeps the focused app/window in the center and places recently used apps/windows along the left side for quick switching.
- Users can arrange, resize, and overlap windows in their preferred center layout.
- Multiple apps can work together as a group. Switching to a group brings all apps in that group back to the center.
- Users can drag an app from the left side into the center to group it, and drag it back to the left to ungroup it.
- If recent apps are hidden, moving the pointer to the left edge can reveal them.
- macOS has a setting for app windows: show all windows from an application at once, or show one at a time and cycle through app windows by clicking the left-side item again.

## Mapping To Super Admin

- Treat a module as the closest equivalent of a macOS app.
- Treat workspace tabs/routes as the equivalent of app windows.
- Stage Manager should group tabs by module, for example all Users routes become one Users group.
- A group thumbnail should show a stacked preview when it contains multiple tabs.
- Clicking a group should activate the most recent tab in that module group.
- A second-level expansion should reveal the individual tabs in that module group.
- MVP should not implement drag-to-group/ungroup because routes already have a natural module owner; manual grouping can be a later task.

## Source Notes

Apple describes Stage Manager as keeping the current app centered, recently used apps on the left, and allowing multiple apps to work together as a group. It also documents adding/removing apps from groups and an "all at once" vs "one at a time" setting for windows from the same application.
