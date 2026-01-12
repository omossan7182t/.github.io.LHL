export class LanguageRegistry {
  private static languages = new Map<string, LanguageDef>();

  static register(lang: LanguageDef) {
    this.validate(lang);
    this.languages.set(lang.id, lang);
  }

  static get(id: string) {
    const lang = this.languages.get(id);
    if (!lang) throw new Error(`Language not found: ${id}`);
    return lang;
  }

  static validate(lang: LanguageDef) {
    if (!lang.id) throw new Error("language.id is required");
    if (!lang.commands) throw new Error("language.commands is required");
  }
}
