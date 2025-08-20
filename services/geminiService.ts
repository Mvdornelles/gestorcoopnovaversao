
import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { mockCooperados } from '../data/mockData';

// This is a MOCK implementation. In a real application, the API key would be
// securely managed on a server and not exposed on the client-side.
// We are assuming process.env.API_KEY is available for this simulation.
const MOCK_API_KEY = "YOUR_API_KEY_HERE";

// Initialize the Google AI client.
// In a real app, you'd handle the case where the API key is missing.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || MOCK_API_KEY });

// This would hold the chat instance in a real application.
let chat: Chat | null = null;

function getChatInstance(): Chat {
    if (!chat) {
        chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: `Você é "Sofia", uma consultora de IA para a plataforma GestorCoop. Sua função é fornecer insights precisos e acionáveis sobre os dados da cooperativa. Seja concisa e direta. Quando um usuário mencionar o nome de um cooperado, você deve automaticamente buscar e apresentar um resumo dos dados dele, sem que o usuário precise pedir. Responda em português.`,
            },
        });
    }
    return chat;
}

const simulateApiCall = <T,>(data: T, delay = 1500): Promise<T> => {
    return new Promise(resolve => setTimeout(() => resolve(data), delay));
}

// Simulates sending a message to the Gemini API chat.
export const sendChatMessage = async (message: string): Promise<string> => {
    console.log("Simulating sending message to Gemini:", message);

    const lowerCaseMessage = message.toLowerCase();
    
    // Feature: Automatic data lookup for mentioned members
    const mentionedCooperado = mockCooperados.find(c => lowerCaseMessage.includes(c.name.toLowerCase()));

    if (mentionedCooperado) {
        const responseText = `Aqui estão os dados de **${mentionedCooperado.name}**:
        - **Nível:** ${mentionedCooperado.tier}
        - **Cliente desde:** ${new Date(mentionedCooperado.since).toLocaleDateString('pt-BR')}
        - **Valor em Pipeline:** ${mentionedCooperado.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        - **Email:** ${mentionedCooperado.email}
        
        Posso ajudar com mais alguma análise sobre ${mentionedCooperado.name}?`;
        return simulateApiCall(responseText);
    }
    
    // Generic canned responses for demonstration
    if (lowerCaseMessage.includes("risco de churn")) {
        const responseText = "Analisando os dados... A análise preditiva indica que os cooperados com baixa interação nos últimos 90 dias e valor de pipeline estagnado têm um risco de churn 35% maior. Recomendo uma campanha de reengajamento para este segmento.";
        return simulateApiCall(responseText);
    }

    if (lowerCaseMessage.includes("gerar e-mail")) {
        const responseText = `Claro! Aqui está um rascunho de e-mail de follow-up:
        
        **Assunto:** Acompanhamento da nossa conversa sobre investimentos
        
        Olá [Nome do Cooperado],
        
        Espero que esteja tudo bem.
        
        Estou escrevendo para dar seguimento à nossa conversa sobre seus objetivos de investimento. Com base no que discutimos, preparei uma proposta personalizada que acredito estar alinhada com suas expectativas.
        
        Você teria um momento esta semana para conversarmos por 15 minutos?
        
        Atenciosamente,
        [Seu Nome]`;
        return simulateApiCall(responseText);
    }

    // Default response using a mock of the actual SDK call structure
    try {
        // This part simulates the structure of a real call but returns a mocked response.
        // const chatSession = getChatInstance();
        // const result = await chatSession.sendMessage({ message });
        // return result.text; // In a real scenario

        const defaultResponse = "Entendido. Processando sua solicitação... Com base nos dados atuais, a tendência de crescimento de novos cooperados é de 15% ao mês. O produto mais popular é o 'Crédito Pessoal'.";
        return simulateApiCall(defaultResponse);

    } catch (error) {
        console.error("Error sending message to Gemini (mock):", error);
        return "Desculpe, não consegui processar sua solicitação no momento.";
    }
};