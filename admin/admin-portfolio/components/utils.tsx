export const parseTextWithFormatting = (text: string) => {
        // Recursive function to handle nested formatting
        const parseRecursive = (input: string): React.ReactNode[] => {
            // Split by all formatting markers: **, {{, }}, ~
            const parts = input.split(/(\*\*[^*]*\*\*|\{\{[^}]*\}\}|~[^~]*~)/);
            
            return parts.map((part, index) => {
                // Check for bold text **text**
                if (part.startsWith('**') && part.endsWith('**')) {
                    const content = part.slice(2, -2);
                    return <b key={index}>{parseRecursive(content)}</b>;
                }
                // Check for green text {{text}}
                else if (part.startsWith('{{') && part.endsWith('}}')) {
                    const content = part.slice(2, -2);
                    return <span key={index} className="text-green">{parseRecursive(content)}</span>;
                }
                // Check for italic text ~text~
                else if (part.startsWith('~') && part.endsWith('~')) {
                    const content = part.slice(1, -1);
                    return <i key={index}>{parseRecursive(content)}</i>;
                }
                // Return regular text as is
                return part;
            });
        };
        
        return parseRecursive(text);
    };

