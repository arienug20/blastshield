# Getting Started with BlastShield

Welcome to BlastShield! This guide will help you get up and running quickly.

## What is BlastShield?

BlastShield is a web-based engineering tool for designing blast walls and blast-resistant panels against Vapor Cloud Explosions (VCE). It helps process safety engineers, structural engineers, and facilities engineers perform quick assessments and detailed blast wall designs.

## First Analysis in 5 Minutes

### Step 1: Start the Application

```bash
cd blastshield
npm install
npm run dev
```

Open your browser to `http://localhost:5173`

### Step 2: Select Your Fuel

From the dropdown, choose a fuel type. Common choices:

- **Methane** - Natural gas (low reactivity)
- **Propane** - LPG (medium reactivity)
- **Hydrogen** - High reactivity, requires special attention
- **Ethylene** - Common in petrochemical plants

### Step 3: Enter Flammable Mass

Enter the amount of fuel that could participate in the explosion. Example:
- For a small leak: 100-500 kg
- For a large tank failure: 5000-10000 kg

### Step 4: Set Confinement Level

Choose the geometric constraint on expanding combustion products:

| Level | Description | Example |
|-------|-------------|---------|
| **1D** | Unidirectional expansion | Tunnel-like arrangement |
| **2D** | Planar expansion | Grate, open-sided shelter |
| **2.5D** | Semi-confined | Process area with roof |
| **3D** | Fully confined | Enclosed building |

### Step 5: Set Congestion Level

Choose the density of obstacles that promote flame acceleration:

- **Low** - Open areas, minimal equipment
- **Medium** - Typical process plant
- **High** - High congestion, multi-level platforms

**Pro Tip:** Use the Congestion Assessment Wizard for an objective rating!

### Step 6: Set Standoff Distance

Enter the distance from the explosion cloud center to your target (building, wall, or personnel). Example:
- 20 m - Close proximity, severe damage possible
- 50 m - Moderate distance
- 100 m - Far field, lower overpressure

### Step 7: Run the Analysis

Click the **"Run Analysis"** button.

### Step 8: Review Results

You'll see:

- **Peak Overpressure** (bar) - Maximum pressure above ambient
- **Flame Speed** (Mach) - Turbulent flame front velocity
- **Impulse** (bar·ms) - Pressure integrated over time
- **Duration** (ms) - Positive phase duration

## Understanding the Interface

### Navigation

The application is organized into several modules:

1. **VCE Calculator** - Analyze vapor cloud explosions
2. **Blast Wall Designer** - Design steel/RC blast walls
3. **Blast Loading** - Analyze structural response (SDOF)
4. **Visualization** - View contour maps and damage zones
5. **Damage Assessment** - Check building/personnel damage thresholds
6. **Safe Distance** - Calculate safe distances for different criteria

### Input Panels

Each module has an input panel where you enter parameters. Required fields are marked.

### Result Cards

Results are displayed in color-coded cards:

- 🟢 **Green** - Pass criteria met
- 🟡 **Yellow** - Marginal, review recommended
- 🔴 **Red** - Fail criteria, redesign required

### Method Toggle

For VCE analysis, you can choose between:

- **BST** - Baker-Strehlow-Tang (most detailed)
- **TNT** - TNT equivalent (quick cross-check)
- **TNO** - TNO multi-energy (source strength based)
- **All** - Compare all three methods

## Saving Your Work

### Auto-Save

BlastShield automatically saves your work to browser storage (IndexedDB). Your inputs and results are preserved even if you close the browser.

### Manual Save

1. Click **"Save Project"** in the header
2. Enter a project name and description
3. Click **"Save"**

### Load Project

1. Click **"Load Project"** in the header
2. Select a project from the list
3. Click **"Load"**

### Export

You can export your work in two formats:

- **PDF** - Full engineering report with all calculations
- **JSON** - Raw data for further analysis or integration

## Next Steps

### Learn More

- [VCE Analysis Tutorial](./vce-tutorial.md) - Deep dive into VCE methods
- [Blast Wall Design Walkthrough](./blast-wall-walkthrough.md) - How to design blast walls
- [P-I Diagram Guide](./pi-diagram-guide.md) - Understanding pressure-impulse damage
- [Glossary](./glossary.md) - Blast terminology explained

### Common Workflows

#### Workflow 1: Quick VCE Assessment
1. Select fuel and enter mass
2. Set confinement and congestion
3. Enter standoff distance
4. Run BST analysis
5. Review results and cross-check with TNT

#### Workflow 2: Blast Wall Design
1. Complete VCE analysis
2. Use blast loading results as input
3. Set wall dimensions and boundary conditions
4. Select material
5. Run wall design
6. Check pass/fail criteria
7. Adjust parameters if needed

#### Workflow 3: Safe Distance Calculation
1. Complete VCE analysis
2. Go to Safe Distance module
3. View safe distances for different criteria
4. Mark safe zones on your layout

## Tips and Best Practices

### Confinement Assessment

- Use the most conservative confinement level if uncertain
- Consider both physical confinement and geometric constraints
- Roof cover can significantly increase confinement

### Congestion Assessment

- Use the Congestion Assessment Wizard for objective rating
- Count ALL obstacles in the flame path (pipes, equipment, structures)
- Obstacle layers are more important than individual obstacle size

### Fuel Selection

- Use the specific fuel if known
- For mixed fuels, use the most reactive component
- Consider vapor density - heavier gases may pool at ground level

### Flammable Mass

- For conservative design, use the worst-case scenario
- Consider the maximum inventory that could participate
- Include fuel from adjacent tanks/lines if interconnection possible

### Standoff Distance

- Measure from the likely cloud center (leak source, equipment center)
- Use the closest point of the target building
- For personnel safety, use the distance to occupied areas

### Wall Design

- Check both deflection and ductility criteria
- Consider using higher-grade materials if design fails
- Boundary conditions significantly affect required thickness

## Troubleshooting

### Results Seem Unrealistic

1. Check input values for reasonableness
2. Verify confinement and congestion levels
3. Compare BST, TNT, and TNO methods
4. Review fuel properties in the fuel library

### Wall Design Fails

1. Reduce deflection limit (increase allowable deflection)
2. Increase ductility limit (allow more plastic response)
3. Use higher-grade material
4. Consider different boundary conditions
5. Increase wall dimensions

### Cannot Save Project

1. Check browser storage permissions
2. Clear browser cache and try again
3. Use Export JSON as backup

## Getting Help

If you have questions or issues:

1. Check the documentation in the `/docs` folder
2. Review the glossary for terminology
3. Try the example workflows
4. Report bugs or feature requests on GitHub

---

Happy blast shielding! Stay safe! ⚡