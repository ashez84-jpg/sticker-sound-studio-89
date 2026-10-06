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
- Keep pajama choices gender-specific while preserving preset calibration keys and avatar geometry, so changing clothing patterns does not shift medical-sticker placement.
- Translate UI text through useLang().t() with Spanish strings keyed by the English original in src/lib/i18n.tsx; why: one place to add or fix translations, English fallback when missing.
- Animate bedtime as a cancellable ready/dancing/settling/sleeping sequence with clipped bitmap limbs and their calibrated stickers inside one moving parent layer; why: arm waves and steps retain sensor placement while restart cancels the ending cleanly.
