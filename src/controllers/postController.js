import { supabase } from "../config/supabaseClient.js";

// ✅ Create Post (Protected)
export const createPost = async (req, res) => {
    try {
        const { title, content } = req.body;

        const { data, error } = await supabase
            .from("posts")
            .insert([
                {
                    title,
                    content,
                    user_id: req.user.id,
                },
            ])
            .select();

        if (error) return res.status(400).json({ error: error.message });

        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const getPosts = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("posts")
            .select("*");

        if (error) return res.status(400).json({ error: error.message });

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const getPostById = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from("posts")
            .select("*")
            .eq("id", id)
            .single();

        if (error) return res.status(404).json({ error: "Post not found" });

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const updatePost = async (req, res) => {

    try {

        const { id } = req.params;
        const { title, content } = req.body;

        const { data: post, error: fetchError } = await supabase
            .from("posts")
            .select("*")
            .eq("id", id)
            .single();

        if (fetchError || !post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Check ownership
        if (post.user_id !== req.user.id) {
            return res.status(403).json({ error: "Not authorized" });
        }

        const { data, error } = await supabase
            .from("posts")
            .update({
                title,
                content,
                updated_at: new Date()
            })
            .eq("id", id)
            .select();

        if (error) return res.status(400).json({ error: error.message });

        res.json({
            message: "Post updated successfully",
            data
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }

};

export const deletePost = async (req, res) => {

    try {

        const { id } = req.params;

        const { data: post, error: fetchError } = await supabase
            .from("posts")
            .select("*")
            .eq("id", id)
            .single();

        if (fetchError || !post) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (post.user_id !== req.user.id) {
            return res.status(403).json({ error: "Not authorized" });
        }

        const { error } = await supabase
            .from("posts")
            .delete()
            .eq("id", id);

        if (error) return res.status(400).json({ error: error.message });

        res.json({
            message: "Post deleted successfully"
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }



}
