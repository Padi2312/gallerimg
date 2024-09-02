export const focus = (node: HTMLElement) => {
    $effect(() => {
        node.focus();
        return () => { };
    });
} 