import Eris from "eris";

// Eris
export interface SlashCommand {
    config: Eris.ChatInputApplicationCommandStructure;
    action: Function;
}

export interface Import {
    filename: string;
    import: SlashCommand;
}