<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep hidden-object artwork for both I Spy scenes as reusable transparent assets, with placement-specific perspective and camouflage handled by scene data and global semantic styling.
- Keep the root route as the study chooser and share the calibrated character game between separate Sleep Study and CPAP Study routes; why: both activities retain the same avatar and bedtime behavior while study-specific equipment stays isolated.
- Keep pajama choices gender-specific while preserving preset calibration keys and avatar geometry, so changing clothing patterns does not shift medical-sticker placement.
- Translate UI text through useLang().t() with Spanish strings keyed by the English original in src/lib/i18n.tsx; why: one place to add or fix translations, English fallback when missing.
- Use Framer Motion for the cancellable ready/dancing/settling/sleeping sequence, keeping clipped bitmap limbs and calibrated stickers in one moving parent; why: state changes stop prior motion and preserve sensor alignment.
- Use matched transparent awake/sleeping avatar assets with the same canvas geometry, shallow front-facing turns without duplicate silhouette layers, and a shared end-of-climb/sleep pose calibrated to the tucked cover ridge; why: bitmap artwork cannot show a true back surface, and one bed pose prevents head/body misalignment.
