import { supabase } from '../lib/supabaseClient';
import { Tables, Enums } from '../types/supabase';

// Re-exporting types for convenience
export type Produto = Tables<'produtos'>['Row'];
export type Tarefa = Tables<'tarefas'>['Row'];
export type Cooperado = Tables<'cooperados'>['Row'];
export type Oportunidade = Tables<'oportunidades'>['Row'];
export type Interaction = Tables<'interacoes'>['Row'];
export type TierCooperado = Enums<'tier_cooperado'>;
export type EstagioOportunidade = Enums<'estagio_oportunidade'>;
export type PrioridadeTarefa = Enums<'prioridade_tarefa'>;


// API Functions

/**
 * Fetches all products from the database.
 */
export const getProducts = async (): Promise<Produto[]> => {
  const { data, error } = await supabase.from('produtos').select('*');

  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }

  return data;
};

/**
 * Adds a new product to the database.
 */
export const addProduct = async (productData: Omit<Produto, 'id' | 'created_at' | 'user_id'>): Promise<Produto> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated for this operation.");

  const { data, error } = await supabase
    .from('produtos')
    .insert([{ ...productData, user_id: user.id }])
    .select()
    .single();

  if (error) {
    console.error('Error adding product:', error);
    throw error;
  }
  return data;
};

/**
 * Updates an existing product.
 */
export const updateProduct = async (id: number, productData: Partial<Omit<Produto, 'id'>>): Promise<Produto> => {
  const { data, error } = await supabase
    .from('produtos')
    .update(productData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating product:', error);
    throw error;
  }
  return data;
};

/**
 * Deletes a product from the database.
 */
export const deleteProduct = async (id: number): Promise<void> => {
  const { error } = await supabase.from('produtos').delete().eq('id', id);

  if (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

/**
 * Fetches all tasks from the database for the current user.
 */
export const getTasks = async (userId: string): Promise<Tarefa[]> => {
    const { data, error } = await supabase
        .from('tarefas')
        .select('*')
        .eq('user_id', userId);

    if (error) {
        console.error('Error fetching tasks:', error);
        throw error;
    }
    return data;
}

export const updateInteraction = async (id: number, interactionData: Partial<Omit<Interaction, 'id'>>): Promise<Interaction> => {
    const { data, error } = await supabase
        .from('interacoes')
        .update(interactionData)
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return data;
}

// Oportunidades
export type OportunidadeWithCooperado = Oportunidade & {
    cooperados: Cooperado | null;
}

export const getOportunidades = async (userId: string): Promise<OportunidadeWithCooperado[]> => {
    const { data, error } = await supabase
        .from('oportunidades')
        .select(`
            *,
            cooperados (*)
        `)
        .eq('user_id', userId);

    if (error) {
        console.error('Error fetching oportunidades', error);
        throw error;
    }
    return data as OportunidadeWithCooperado[];
}

export const addOportunidade = async (oportunidadeData: Omit<Oportunidade, 'id' | 'created_at' | 'user_id'>): Promise<Oportunidade> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
        .from('oportunidades')
        .insert([{ ...oportunidadeData, user_id: user.id }])
        .select()
        .single();
    if (error) throw error;
    return data;
}

export const updateOportunidade = async (id: number, oportunidadeData: Partial<Omit<Oportunidade, 'id'>>): Promise<Oportunidade> => {
    const { data, error } = await supabase
        .from('oportunidades')
        .update(oportunidadeData)
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return data;
}

export const deleteOportunidade = async (id: number): Promise<void> => {
    const { error } = await supabase.from('oportunidades').delete().eq('id', id);
    if (error) throw error;
}

export const updateOportunidadeStage = async (id: number, stage: EstagioOportunidade): Promise<Oportunidade> => {
    const { data, error } = await supabase
        .from('oportunidades')
        .update({ stage })
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return data;
}

export const deleteInteraction = async (id: number): Promise<void> => {
    const { error } = await supabase.from('interacoes').delete().eq('id', id);
    if (error) throw error;
}

// Chat
export type Conversation = Tables<'conversations'>['Row'];
export type ChatMessage = Tables<'chat_messages'>['Row'];

export const getConversations = async (userId: string): Promise<Conversation[]> => {
    const { data, error } = await supabase.from('conversations').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) throw error;
    return data;
}

export const getConversationMessages = async (conversationId: string): Promise<ChatMessage[]> => {
    const { data, error } = await supabase.from('chat_messages').select('*').eq('conversation_id', conversationId).order('created_at', { ascending: true });
    if (error) throw error;
    return data;
}

export const createConversation = async (userId: string, title: string): Promise<Conversation> => {
    const { data, error } = await supabase.from('conversations').insert([{ user_id: userId, title }]).select().single();
    if (error) throw error;
    return data;
}

export const addChatMessage = async (messageData: Omit<ChatMessage, 'id' | 'created_at'>): Promise<ChatMessage> => {
    const { data, error } = await supabase.from('chat_messages').insert([messageData]).select().single();
    if (error) throw error;
    return data;
}

export const addCooperado = async (cooperadoData: Omit<Cooperado, 'id' | 'created_at' | 'user_id'>): Promise<Cooperado> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
        .from('cooperados')
        .insert([{ ...cooperadoData, user_id: user.id }])
        .select()
        .single();
    if (error) throw error;
    return data;
}

export const updateCooperado = async (id: number, cooperadoData: Partial<Omit<Cooperado, 'id'>>): Promise<Cooperado> => {
    const { data, error } = await supabase
        .from('cooperados')
        .update(cooperadoData)
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return data;
}

/**
 * Adds a new task.
 */
export const addTask = async (taskData: Omit<Tarefa, 'id' | 'created_at' | 'completed'>): Promise<Tarefa> => {
    const { data, error } = await supabase
        .from('tarefas')
        .insert([{ ...taskData, completed: false }])
        .select()
        .single();

    if (error) {
        console.error('Error adding task:', error);
        throw error;
    }
    return data;
}

/**
 * Updates an existing task.
 */
export const updateTask = async (id: number, taskData: Partial<Omit<Tarefa, 'id'>>): Promise<Tarefa> => {
    const { data, error } = await supabase
        .from('tarefas')
        .update(taskData)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating task:', error);
        throw error;
    }
    return data;
}

/**
 * Deletes a task.
 */
export const deleteTask = async (id: number): Promise<void> => {
    const { error } = await supabase.from('tarefas').delete().eq('id', id);

    if (error) {
        console.error('Error deleting task:', error);
        throw error;
    }
}

// Cooperados

export type CooperadoDetail = Cooperado & {
    interacoes: Interaction[];
}

/**
 * Fetches all cooperados for the current user.
 */
export const getCooperados = async (userId: string): Promise<Cooperado[]> => {
    const { data, error } = await supabase
        .from('cooperados')
        .select('*')
        .eq('user_id', userId);

    if (error) {
        console.error('Error fetching cooperados', error);
        throw error;
    }
    return data;
}

/**
 * Fetches a single cooperado by their ID, including their timeline of interactions.
 */
export const getCooperadoById = async (id: number): Promise<CooperadoDetail | null> => {
    const { data, error } = await supabase
        .from('cooperados')
        .select(`
            *,
            interacoes ( * )
        `)
        .eq('id', id)
        .single();

    if (error) {
        console.error(`Error fetching cooperado with id ${id}`, error);
        throw error;
    }
    // Sort interactions by date descending
    if(data && data.interacoes) {
        data.interacoes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    return data;
}

/**
 * Adds a new interaction for a cooperado.
 */
export const addInteraction = async (interactionData: Omit<Interaction, 'id' | 'created_at' | 'author_id'>): Promise<Interaction> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
        .from('interacoes')
        .insert([{ ...interactionData, author_id: user.id }])
        .select()
        .single();

    if (error) {
        console.error('Error adding interaction:', error);
        throw error;
    }
    return data;
}
