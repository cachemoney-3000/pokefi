import React, { useState } from 'react';
import '../index.css';
import {
	TYPE_COLOR_MAP,
	FALLBACK_ACCENT_COLOR,
	GENERATION_RANGES,
	GEN_FALLBACK_LABEL,
	BST_CEILING,
	STAT_FALLBACK,
	SPRITE_BASE_URL,
	SPRITE_SIZE_PX,
	SPRITE_CONTAINER_HEIGHT_PX,
	SPRITE_TOP_OFFSET_PX,
	HP_BADGE_SIZE_PX,
} from '../utils/constants';

function getGeneration(id) {
	const match = GENERATION_RANGES.find(({ maxId }) => id <= maxId);
	return match ? match.label : GEN_FALLBACK_LABEL;
}

const PokeCard = React.memo(({ pokemon, onClick, showShiny }) => {
	const [isHovered, setIsHovered] = useState(false);

	const frontSprite  = pokemon.sprites?.front_default;
	const shinySprite  = `${SPRITE_BASE_URL}/shiny/${pokemon.id}.png`;
	const types        = pokemon.types || [];
	const stats        = pokemon.stats || [];
	const nameRevise   = pokemon.name
		.split('-')
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(' ');

	const bgColor = TYPE_COLOR_MAP[types[0]?.type.name] || FALLBACK_ACCENT_COLOR;
	const hp      = stats[0]?.base_stat ?? STAT_FALLBACK;
	const bst     = stats.reduce((sum, s) => sum + s.base_stat, 0);
	const bstPct  = Math.min((bst / BST_CEILING) * 100, 100);
	const gen     = getGeneration(pokemon.id);

	const typeSpans = types.map((type, index) => (
		<span
			key={index}
			className="bg-black/25 border border-white/25 text-white text-xs px-2.5 py-1 rounded-lg font-medium leading-none"
		>
			{type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}
		</span>
	));

	const spriteStyle = {
		width: `${SPRITE_SIZE_PX}px`,
		height: `${SPRITE_SIZE_PX}px`,
		top: `${SPRITE_TOP_OFFSET_PX}px`,
		imageRendering: 'pixelated',
	};

	return (
		<div
			className="relative rounded-2xl cursor-pointer overflow-visible"
			style={{
				backgroundColor: bgColor,
				transform: isHovered ? 'scale(1.02)' : 'scale(1)',
				transition: 'transform 0.2s ease, box-shadow 0.2s ease',
				boxShadow: isHovered
					? `0 6px 24px rgba(0,0,0,0.45), 0 0 0 1.5px ${bgColor}80`
					: '0 4px 16px rgba(0,0,0,0.3)',
				willChange: isHovered ? 'transform' : 'auto',
			}}
		onClick={onClick}
		onMouseEnter={() => setIsHovered(true)}
		onMouseLeave={() => setIsHovered(false)}
		>
			{/* Dark gradient overlay */}
			<div
				className="absolute inset-0 rounded-2xl pointer-events-none"
				style={{ background: 'linear-gradient(160deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.32) 55%, rgba(0,0,0,0.52) 100%)' }}
			/>

		{/* Generation badge — top-right corner */}
		<div
			className="absolute top-2.5 right-2.5 z-10 text-[10px] font-semibold px-2 py-0.5 rounded-full"
			style={{ backgroundColor: 'rgba(0,0,0,0.40)', color: 'rgba(255,255,255,0.75)' }}
		>
				{gen}
			</div>

		{/* Sprite — shiny toggle swaps all cards at once; falls back to normal if shiny missing */}
		<div className="relative flex justify-center" style={{ height: `${SPRITE_CONTAINER_HEIGHT_PX}px` }}>
			<img
				className="absolute object-contain transition-opacity duration-200"
				style={spriteStyle}
				src={showShiny ? shinySprite : frontSprite}
				onError={(e) => { e.target.onerror = null; e.target.src = frontSprite; }}
				alt={pokemon.name}
			/>
		</div>

			{/* Content */}
			<div className="relative px-4 pb-3 pt-1">
				<div className="flex items-start justify-between gap-2">
					{/* Left: id, name, types */}
					<div className="min-w-0">
						<div className="text-white/60 text-xs font-light">No. {pokemon.id}</div>
						<div className="text-white font-semibold text-lg leading-tight truncate">{nameRevise}</div>
						<div className="flex gap-1.5 mt-2 flex-wrap">{typeSpans}</div>
					</div>

					{/* Right: HP badge */}
			<div
				className="shrink-0 flex flex-col items-center justify-center rounded-full border border-white/25"
				style={{
					width: `${HP_BADGE_SIZE_PX}px`,
					height: `${HP_BADGE_SIZE_PX}px`,
					backgroundColor: 'rgba(0,0,0,0.38)',
				}}
			>
						<span className="text-white/60 text-[9px] font-semibold uppercase leading-none">HP</span>
						<span className="text-white font-bold text-lg leading-tight">{hp}</span>
					</div>
				</div>

				{/* BST bar */}
				<div className="mt-3 mb-2">
					<div className="flex items-center justify-between mb-1">
						<span className="text-white/50 text-[10px] font-medium uppercase tracking-wide">Strength</span>
						<span className="text-white/70 text-[10px] font-semibold">{bst}</span>
					</div>
					<div className="h-1 w-full rounded-full" style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}>
						<div
							className="h-full rounded-full transition-all duration-500"
							style={{ width: `${bstPct}%`, backgroundColor: 'rgba(255,255,255,0.75)' }}
						/>
					</div>
				</div>
			</div>
		</div>
	);
});

export const PokeCardSkeleton = () => (
	<div className="relative rounded-2xl overflow-visible" style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
		<div className="rounded-2xl animate-pulse" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
			{/* Sprite placeholder */}
			<div className="relative flex justify-center" style={{ height: `${SPRITE_CONTAINER_HEIGHT_PX}px` }}>
				<div
					className="absolute rounded-full"
					style={{
						width: `${SPRITE_SIZE_PX}px`,
						height: `${SPRITE_SIZE_PX}px`,
						top: `${SPRITE_TOP_OFFSET_PX}px`,
						backgroundColor: 'rgba(255,255,255,0.08)',
					}}
				/>
			</div>

			{/* Content placeholder */}
			<div className="px-4 pb-3 pt-1">
				<div className="flex items-start justify-between gap-2">
					<div className="min-w-0 flex-1">
						<div className="h-3 w-10 rounded-full mb-1.5" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
						<div className="h-5 w-28 rounded-full mb-2" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
						<div className="flex gap-1.5">
							<div className="h-5 w-14 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />
							<div className="h-5 w-14 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />
						</div>
					</div>
					<div
						className="shrink-0 rounded-full"
						style={{ width: `${HP_BADGE_SIZE_PX}px`, height: `${HP_BADGE_SIZE_PX}px`, backgroundColor: 'rgba(255,255,255,0.08)' }}
					/>
				</div>

				{/* BST bar placeholder */}
				<div className="mt-3 mb-2">
					<div className="flex items-center justify-between mb-1">
						<div className="h-2.5 w-12 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />
						<div className="h-2.5 w-6 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />
					</div>
					<div className="h-1 w-full rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
				</div>
			</div>
		</div>
	</div>
);

export default PokeCard;
