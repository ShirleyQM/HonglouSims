import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const listeners = new Map();
let clock = 1440;
const chars = [{ id: 'daiyu', short: '黛玉', sceneId: 'xiaoxiang', memories: [{text:'旧日相会',with:'baoyu',tag:'温情',day:1}] }, {id:'baoyu',short:'宝玉',sceneId:'xiaoxiang',memories:[]}];
const ctx = { window: {}, CHARS: chars, gameDay: 1, CONFIG: {}, relations: {},
 getGameTimestamp:()=>clock, getChar:id=>chars.find(c=>c.id===id), relKey:(a,b)=>[a,b].sort().join('|'),
 NarrativeBubbleSystem:{showBubble:()=>false}, QuestSystem:{tpl:()=>({name:'送书'})},
 TraitEffectSystem:{memoryChanceMultiplier:()=>1,memoryStrengthMultiplier:()=>1,memoryDecayMultiplier:()=>1,traitsOf:()=>[],has:()=>false},
 getInteractionTemplate:()=>({category:'xiantan'}),
 EventBus:{on(type,fn){const set=listeners.get(type)||new Set();set.add(fn);listeners.set(type,set);return ()=>set.delete(fn);},emit(type,e){for(const fn of listeners.get(type)||[])fn(e);}},
 Math:Object.assign(Object.create(Math),{random:()=>0}),
};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(new URL('../js/systems/trait-behavior.js',import.meta.url),'utf8'),ctx);
const system=ctx.window.TraitBehaviorSystem;
system.init();
const legacyId=chars[0].memories[0].id;
assert(legacyId);system.syncMemories();assert.equal(chars[0].memories[0].id,legacyId);
ctx.EventBus.emit('interaction:complete',{initiatorId:'daiyu',targetId:'baoyu',interactionName:'闲谈',category:'xiantan'});
ctx.EventBus.emit('relation:axis_change',{idA:'daiyu',idB:'baoyu',axis:'trust',old:0,new:6});
ctx.EventBus.emit('quest:completed',{assigneeId:'daiyu',issuerId:'baoyu',templateId:1,instanceId:'q1'});
ctx.EventBus.emit('state:add',{charId:'daiyu',stateId:'elated',stateName:'欢喜',stateDef:{moodDelta:6}});
assert.equal(chars[0].memories.length,5);
ctx.EventBus.emit('quest:completed',{assigneeId:'daiyu',issuerId:'baoyu',templateId:1,instanceId:'q1'});
assert.equal(chars[0].memories.length,5);
let memory=chars[0].memories.find(m=>m.source==='interaction:complete');
const start=memory.strength;
const days=[];
for(let day=2;day<=5;day++) {clock=day*1440;ctx.gameDay=day;ctx.EventBus.emit('time:day',{});memory=chars[0].memories.find(m=>m.id===memory.id);days.push({day,strength:memory.strength});}
assert(memory.strength<start);
system.reinforceMemory(chars[0],memory.id,0.7);
assert(memory.strength>days.at(-1).strength);
const input=system.buildSocialDecisionInput(chars[0],'baoyu',{tags:['xiantan'],sceneId:'xiaoxiang'});
assert(input.recentMemories.some(m=>m.id===memory.id));
assert(system.socialMemoryFactor(input)>1);
const positive=system.socialMemoryFactor(input);
system.addMemory(chars[0],{text:'争执伤心',with:'baoyu',tag:'创伤',valence:-1,strength:3},{force:true});
const negative=system.socialMemoryFactor(system.buildSocialDecisionInput(chars[0],'baoyu',{limit:1}));
assert(negative<1);
const ids=ctx.relations['baoyu|daiyu'].memoryIds;
assert(ids.includes(memory.id));assert.equal(ids.length,new Set(ids).size);
const saved=JSON.parse(JSON.stringify(chars[0].memories));chars[0].memories=saved;system.syncMemories();assert.equal(chars[0].memories.find(m=>m.id===memory.id).id,memory.id);
system.addMemory(chars[0],{text:'易逝',strength:0.13,with:'baoyu'},{force:true});
const forgotten=chars[0].memories.at(-1).id;system.decayMemories();assert(!ctx.relations['baoyu|daiyu'].memoryIds.includes(forgotten));
system.init();assert.equal(listeners.get('interaction:complete').size,2);
ctx.TraitBehaviorSystem=system;
ctx.MEMORY_TAG_MODS={};ctx.applyTagMods=f=>f;
const aiSource=fs.readFileSync(new URL('../js/ai.js',import.meta.url),'utf8');
vm.runInContext(aiSource.slice(aiSource.indexOf('function calcMemoryFactor('),aiSource.indexOf('function crowdFactor(')),ctx);
const candidate={targetCharId:'baoyu'};
const actualFactor=ctx.calcMemoryFactor(chars[0],['social'],candidate);
assert(candidate.socialDecisionInput.recentMemories.length);
assert.notEqual(actualFactor,1);
console.log(JSON.stringify({passed:true,days,reinforced:memory.strength,positiveFactor:positive,negativeFactor:negative,relatedMemoryIds:ids},null,2));
