export function getTheme() {
    localStorage.clear();
    let themeRaw = localStorage.getItem('theme');
    if (themeRaw) {
        return JSON.parse(themeRaw);
    } else {
        localStorage.setItem('theme', JSON.stringify(darkTheme));
        return darkTheme;
    }
}

export const darkTheme = {
    sidebar: {
        backgroundColor: '#000000'
    },
    filePane: {
        backgroundColor: '#21252B',
        height: '100%',
        width: '100%'
    },
};
