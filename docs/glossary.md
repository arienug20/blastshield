# Glossary of Blast Terminology

This glossary defines key terms used in blast analysis, blast wall design, and VCE (Vapor Cloud Explosion) studies.

## A-C

### Ambient Pressure (P₀)
The atmospheric pressure at the site. Standard atmospheric pressure is 1.013 bar (101.3 kPa) at sea level.

### Ambient Temperature
The air temperature at the site, typically 293 K (20°C) for standard conditions.

### Arrival Time (ta)
The time it takes for the blast wave to travel from the explosion source to a target location.

| Speed | Approximate time |
|-------|-----------------|
| 100 m | ~300 ms |
| 500 m | ~1.5 s |
| 1000 m | ~3 s |

### Blast Wave
A shock wave in air (or other medium) caused by an explosion, characterized by a sharp pressure rise followed by rapid decay.

### Confinement
The degree of geometric constraint on expanding combustion products. Higher confinement leads to higher flame speeds and overpressures.

**Levels:**
- **1D** - Unidirectional expansion (tunnel)
- **2D** - Planar expansion (grate, shelter)
- **2.5D** - Semi-confined (roofed area)
- **3D** - Fully confined (enclosed building)

### Congestion
The density of obstacles in the flame path that promote flame acceleration and turbulence. Obstacles include pipes, equipment, structures, and vessels.

**Levels:**
- **Low** - < 0.5 pipes/m², open areas
- **Medium** - 0.5-2.0 pipes/m², typical process plant
- **High** - > 2.0 pipes/m², dense equipment, multi-level

### Concrete Breakout
Failure mode where a concrete anchor pulls out a cone of concrete around it, rather than the anchor itself failing.

### DDT (Deflagration-to-Detonation Transition)
The process where a subsonic combustion wave (deflagration) transitions to a supersonic detonation. DDT typically requires high confinement and high congestion with high-reactivity fuels (e.g., hydrogen, acetylene).

**Conditions that promote DDT:**
- High confinement (2.5D or 3D)
- High congestion
- High-reactivity fuels (hydrogen, acetylene, ethylene)
- Large cloud volume

### Deflection (δ)
The displacement of a structure from its original position under blast loading. Expressed in millimeters (mm).

**Deflection Limits:**
- **Span/360** - Elastic limit (no permanent deformation)
- **Span/120** - Moderate damage limit
- **Span/60** - Typical blast-resistant (ductile response OK)
- **Span/40** - High ductility allowed

### DIF (Dynamic Increase Factor)
Factor that accounts for the increase in material strength at high strain rates (typically 100-500 1/s for blast loads).

**Typical DIF values:**
| Strain Rate (1/s) | Concrete | Steel | Rebar |
|-------------------|----------|-------|-------|
| 1 | 1.0 | 1.0 | 1.0 |
| 100 | 1.19 | 1.20 | 1.17 |
| 500 | 1.25 | 1.25 | 1.29 |

### DLF (Dynamic Load Factor)
Ratio of dynamic response to static response. DLF depends on the ratio of blast duration (td) to structural natural period (Tn).

**DLF vs td/Tn (triangular load):**
| td/Tn | DLF |
|-------|-----|
| 0.1 | 0.2 |
| 0.5 | 1.0 |
| 1.0 | 2.0 |
| 2.0 | 2.0 |
| 5.0 | 0.4 |

**Key points:**
- Maximum DLF occurs at td/Tn ≈ 1
- Very short blasts (td << Tn) behave like impulse
- Very long blasts (td >> Tn) behave like static loads

### Ductility (μ)
Ability of a material to deform plastically without fracturing. In blast design, ductility ratio is the ratio of maximum displacement to yield displacement.

**Ductility limits:**
| Structural Type | Typical Limit |
|-----------------|---------------|
| Concrete walls | 3-5 |
| Steel plates | 5-10 |
| Frames | 6-12 |

### Dynamic Pressure (q)
The pressure associated with the movement of air behind the shock front. Important for drag-sensitive structures.

```
q ≈ 2.5 × Ps² / (Ps + 7)
```

## D-I

### Eardrum Rupture Threshold
The overpressure level at which eardrum rupture becomes probable.

| Overpressure | Probability |
|--------------|-------------|
| 0.07 bar | 1% |
| 0.21 bar | 50% |

### Friedlander Waveform
Empirical equation describing blast pressure time-history:

**Positive phase:**
```
P(t) = Ps × (1 - t/td) × e^(-αt/td)
```

**Negative phase:**
```
P(t) = -Pmin × (t/td_neg - 1) × e^(-β(t-td)/td_neg)
```

Where:
- `Ps` - Peak positive overpressure
- `td` - Positive phase duration
- `α` - Decay coefficient (typically ~1.0)
- `Pmin` - Peak negative overpressure (~0.3-0.5 × Ps)
- `td_neg` - Negative phase duration (~2-3 × td)

### Flammable Mass (M)
The mass of fuel that can participate in the explosion. Typically estimated from dispersion modeling or worst-case inventory.

### Flame Speed (Mf)
Turbulent flame front velocity expressed as a Mach number. Higher flame speeds produce higher overpressures.

**Typical values:**
| Condition | Flame Speed (Mach) |
|-----------|-------------------|
| Slow burn (low confinement/congestion) | 0.1-0.3 |
| Moderate | 0.5-1.5 |
| Fast burn (high confinement/congestion) | 2.0-4.0 |
| Detonation | > 5.0 |

### Heat of Combustion (ΔHc)
Energy released per unit mass during complete combustion. Expressed in kJ/kg.

**Typical values:**
| Fuel | ΔHc (kJ/kg) |
|------|-------------|
| Methane | 55,500 |
| Propane | 50,350 |
| Hydrogen | 120,000 |
| Ethylene | 50,300 |

### Impulse (I)
Integral of pressure over time. Determines the energy imparted to a structure. Expressed in bar·ms or kPa·ms.

```
I = ∫ P(t) dt
```

**Physical significance:**
- Momentum transfer to structure
- Governs displacement response
- Important for impulsive loading (short duration)

### Iso-Damage Curves
Curves on a P-I diagram representing constant damage levels. Each curve has a pressure-controlled asymptote (short blasts) and an impulse-controlled asymptote (long blasts).

### Laminar Burning Velocity (SL)
Flame speed under laminar (un-turbulent) conditions. Base value used in flame speed calculations.

| Fuel | SL (m/s) |
|------|----------|
| Methane | 0.38 |
| Propane | 0.46 |
| Hydrogen | 2.0 |
| Acetylene | 1.55 |

## L-O

### Lower Flammable Limit (LFL)
Minimum fuel concentration in air that will support combustion. Expressed as volume percent.

| Fuel | LFL (vol%) |
|------|------------|
| Methane | 5.0 |
| Propane | 2.1 |
| Hydrogen | 4.0 |
| Acetylene | 2.5 |

### Lung Damage Threshold
Overpressure level at which lung damage becomes probable (~0.35 bar). Lung damage is typically fatal.

### Negative Phase
Suction phase of the blast wave following the positive phase. Typically has lower amplitude but longer duration. Can cause implosion-type damage.

### Natural Period (Tn)
Time for one cycle of free vibration of a structure.

```
Tn = 2π × √(M_eff / K_eff)
```

**Typical values:**
| Structure | Tn (ms) |
|-----------|---------|
| Steel plate (3m span) | 10-30 |
| Concrete wall (3m span) | 20-50 |
| Steel frame | 100-500 |

### Overpressure (Ps)
Pressure above ambient caused by the blast wave. The primary measure of blast severity.

**Typical ranges:**
| Overpressure (bar) | Effect |
|-------------------|--------|
| < 0.01 | No damage |
| 0.01-0.03 | Minor damage (windows crack) |
| 0.03-0.07 | Light damage (windows shattered) |
| 0.07-0.15 | Moderate damage (walls cracked) |
| 0.15-0.30 | Heavy damage (structural damage) |
| > 0.50 | Severe to catastrophic |

### Plastic Moment (Mp)
Moment at which a section develops its full plastic capacity. Used in yield line theory.

```
Mp = fy × Zp
```

Where:
- `fy` - Yield strength
- `Zp` - Plastic section modulus

### Positive Phase
Initial compressive phase of the blast wave, characterized by a sharp pressure rise followed by exponential decay.

## P-Z

### P-I Diagram
Pressure-Impulse diagram showing iso-damage curves. Used to assess damage potential for different blast scenarios.

**Quadrants:**
1. **Pressure-controlled** - Short blasts (low td/Tn), peak pressure dominates
2. **Impulse-controlled** - Long blasts (high td/Tn), impulse dominates
3. **Combined** - Both pressure and impulse matter

### Plastic Modulus (Zp)
Section modulus for plastic analysis. For rectangular plates: `Zp = b × t² / 4`.

### Reactivity Class
Classification of fuels based on tendency to accelerate flame.

| Class | Fuels | Characteristics |
|-------|-------|-----------------|
| Low | Methane, ammonia | Slow burning, low overpressure |
| Medium | Propane, butane | Moderate overpressure |
| High | Hydrogen, acetylene, ethylene | Fast burning, high overpressure, DDT possible |

### Sachs Scaling
Non-dimensional scaling method for blast parameters using ambient pressure and energy.

**Scaled distance:**
```
Z = R / (E/P₀)^(1/3)
```

**Scaled overpressure:**
```
P̄s = Ps / P₀
```

### SDOF (Single Degree of Freedom)
Simplified structural model representing a structure as a single mass connected to ground through a spring and damper.

**Use cases:**
- Quick response estimation
- Design iteration
- Educational purposes

**Limitations:**
- Only captures one vibration mode
- Assumes uniform response
- May underestimate complex behavior

### Scaled Distance (Z)
Distance normalized by explosive energy or mass. Used to compare different explosions.

**For TNT:**
```
Z = R / W^(1/3)
```

**For BST:**
```
Z = R / (E/P₀)^(1/3)
```

Where:
- `R` - Standoff distance (m)
- `W` - TNT mass (kg)
- `E` - Energy (J)
- `P₀` - Ambient pressure (Pa)

### Standoff Distance (R)
Distance from explosion source to target. Critical parameter for blast overpressure.

**Measurement:**
- Measure from cloud center (source or equipment center)
- Use closest point of target
- For personnel, measure to occupied areas

### TNT Equivalent Mass
Mass of TNT that would produce equivalent blast energy.

```
W_TNT = η × M × ΔHc_fuel / ΔHc_TNT
```

Where:
- `η` - Efficiency factor (3-20%, typically 10%)
- `M` - Flammable mass (kg)
- `ΔHc_fuel` - Fuel heat of combustion (kJ/kg)
- `ΔHc_TNT` - TNT heat of combustion (4680 kJ/kg)

### TNT Equivalency Efficiency Factor (η)
Fraction of fuel energy that contributes to blast.

| Scenario | η |
|----------|---|
| Outdoor, minimal confinement | 0.03 (3%) |
| Typical process area | 0.10 (10%) |
| High congestion/confinement | 0.15 (15%) |
| Confined space | 0.20 (20%) |

### Upper Flammable Limit (UFL)
Maximum fuel concentration in air that will support combustion. Expressed as volume percent.

| Fuel | UFL (vol%) |
|------|------------|
| Methane | 15.0 |
| Propane | 9.5 |
| Hydrogen | 75.0 |
| Acetylene | 82.0 |

### Yield Strength (fy)
Stress at which a material begins to deform plastically.

**Typical values:**
| Material | fy (MPa) |
|----------|----------|
| A36 steel | 250 |
| A572 Gr.50 | 345 |
| A514 | 690 |
| Grade 420 rebar | 420 |
| C30/37 concrete | 30 (compressive) |

### Yield Line Theory
Upper-bound plastic analysis method for plates. Assumes failure occurs along yield lines that form a mechanism.

**Procedure:**
1. Assume yield line pattern
2. Calculate external work (blast load)
3. Calculate internal work (yield line moment × rotation)
4. Equate external work = internal work
5. Solve for required thickness

---

**Need more clarification?** Check the [Getting Started Guide](./getting-started.md) or specific tutorials in the docs folder.