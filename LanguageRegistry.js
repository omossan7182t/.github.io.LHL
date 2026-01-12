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

  static validate(lang) {
    if (!lang.id) {
      throw new Error("language.id is required");
    }
    if (!lang.commands) {
      throw new Error("language.commands is required");
    }
  }
}
