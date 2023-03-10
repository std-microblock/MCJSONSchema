export const getPageAPIUrl = (page: string) => `https://minecraft.fandom.com/zh/api.php?action=parse&format=json&prop=text%7Cmodules%7Cjsconfigvars&text=${encodeURIComponent(`{{:${page}}}`)}`;

export const CUSTOM_WORLD_GEN_URL = "https://minecraft.fandom.com/zh/wiki/%E8%87%AA%E5%AE%9A%E4%B9%89%E4%B8%96%E7%95%8C%E7%94%9F%E6%88%90#%E4%B8%96%E7%95%8C%E9%A2%84%E8%AE%BE%E5%92%8C%E7%BB%B4%E5%BA%A6";