export class LanguageRegistry {
  static languages = new Map();

  static register(lang) {
    this.validate(lang);
    this.languages.set(lang.id, lang);
  }

  static get(id) {
    const lang = this.languages.get(id);
    if (!lang) {
      throw new Error(`Language not found: ${id}`);
    }
    return lang;
  }

  static list() {
    return Array.from(this.languages.values());
  }

  static validate(lang) {
    if (!lang) throw new Error("language is required");
    if (!lang.id) throw new Error("language.id is required");
    if (!lang.name) throw new Error("language.name is required");
    if (!lang.commands) throw new Error("language.commands is required");
  }
}
