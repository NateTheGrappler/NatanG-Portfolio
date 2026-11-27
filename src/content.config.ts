import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

//load in all of the content from the markdown files with the different project descriptions
const githubProjectsCollection = defineCollection 
({
    loader: glob({pattern: '**/*.md', base: './src/content/projects'}),
    schema: z.object({
        title: z.string(),
        githubLink: z.string(),
        repo: z.string().regex(/^[\w.-]+\/[\w.-]+$/, 'repo must be "owner/name"'),
        terminalDesc: z.string(),
        description: z.string(),
        tags: z.array(z.string()).default([]),
        featured: z.boolean().default(false),
        order: z.number().default(99),
    }),
});

//export the collections data out with astro's internals
export const collections = { projects: githubProjectsCollection };