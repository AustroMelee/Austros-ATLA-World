// scripts/srp-llm-scan.ts

import * as fs from 'fs';
import * as path from 'path';

// Define an interface for the analysis results for better type safety
interface AnalysisResult {
    filePath: string;
    extension: string;
    totalLines: number;
    functions: any[];
    classes: any[];
    exports: any[];
    imports: { module: string }[];
    topLevelVariables: any[];
    functionCount: number;
    classCount: number;
    exportCount: number;
    importCount: number;
    topLevelVariableCount: number;
    importedModules: string[];
    srpScore: number;
    srpAnalysis: string;
}

class SRPScanner {
    // --- DECLARE CLASS PROPERTIES ---
    private results: AnalysisResult[];
    private excludedDirs: string[];
    private targetExtensions: string[];

    constructor() {
        this.results = [];
        this.excludedDirs = [
            'node_modules', 'dist', 'dist-scripts', '.git', '.vscode', 'public', 'build'
        ];
        this.targetExtensions = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.mts'];
    }

    scanDirectory(dirPath: string) {
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dirPath, entry.name);
            if (entry.isDirectory()) {
                if (!this.excludedDirs.includes(entry.name) && !entry.name.startsWith('.')) {
                    this.scanDirectory(fullPath);
                }
            } else if (entry.isFile()) {
                if (this.targetExtensions.includes(path.extname(entry.name))) {
                    this.analyzeFile(fullPath);
                }
            }
        }
    }

    analyzeFile(filePath: string) {
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const analysis = this.parseFileContent(content, filePath);
            this.analyzeSRP(analysis);
            this.results.push(analysis);
        } catch (error: unknown) {
            // Handle 'unknown' type in catch block
            const message = error instanceof Error ? error.message : String(error);
            console.error(`Error analyzing ${filePath}:`, message);
        }
    }

    parseFileContent(content: string, filePath: string): AnalysisResult {
        const lines = content.split('\n');
        const nonEmptyLines = lines.filter(line => line.trim() !== '' && !line.trim().startsWith('//'));

        const analysis: Partial<AnalysisResult> = {
            filePath: filePath,
            extension: path.extname(filePath),
            totalLines: nonEmptyLines.length,
            functions: this.extractFunctions(content),
            classes: this.extractClasses(content),
            exports: this.extractExports(content),
            imports: this.extractImports(content),
            topLevelVariables: this.extractTopLevelVariables(content),
        };

        analysis.functionCount = analysis.functions!.length;
        analysis.classCount = analysis.classes!.length;
        analysis.exportCount = analysis.exports!.length;
        analysis.importCount = analysis.imports!.length;
        analysis.topLevelVariableCount = analysis.topLevelVariables!.length;
        analysis.importedModules = analysis.imports!.map(imp => imp.module);
        
        // Ensure all properties of AnalysisResult are set before returning
        return analysis as AnalysisResult;
    }

    analyzeSRP(analysis: AnalysisResult) {
        let score = 0;
        let reasons = [];
        
        const hasClasses = analysis.classCount > 0;
        const hasFunctions = analysis.functionCount > 0;
        const hasTopLevelCode = analysis.topLevelVariableCount > 0;

        if (hasClasses && analysis.classCount > 1) {
            score += analysis.classCount;
            reasons.push(`${analysis.classCount} classes in one file.`);
        }

        if (hasFunctions && analysis.functionCount > 5) {
            score += Math.floor(analysis.functionCount / 3);
            reasons.push(`${analysis.functionCount} functions may indicate too many responsibilities.`);
        }

        if (hasClasses && hasFunctions) {
            score += 3;
            reasons.push(`Mixing class definitions with standalone functions.`);
        }
        
        if ((hasClasses || hasFunctions) && hasTopLevelCode) {
            score += 2;
            reasons.push(`Mixing declarations with executable top-level code.`);
        }

        if (analysis.exportCount > 5) {
            score += analysis.exportCount - 5;
            reasons.push(`${analysis.exportCount} exports suggest the module is a "barrel" or has too many public APIs.`);
        }

        if (analysis.totalLines > 300) {
            score += Math.floor(analysis.totalLines / 100);
            reasons.push(`File is long (${analysis.totalLines} lines), often a sign of multiple responsibilities.`);
        }

        analysis.srpScore = score;
        analysis.srpAnalysis = score > 0 ? reasons.join(' ') : 'Looks good.';
    }

    report() {
        console.log('--- SRP Scan Report ---');
        const problemFiles = this.results
            .filter(file => file.srpScore > 0)
            .sort((a, b) => b.srpScore - a.srpScore);

        const summary = {
            totalFilesScanned: this.results.length,
            filesWithSrpIssues: problemFiles.length
        };

        console.log(JSON.stringify(summary, null, 2));

        if (problemFiles.length > 0) {
            console.log('\n--- Files with Potential SRP Violations (Top 10) ---');
            problemFiles.slice(0, 10).forEach(file => {
                console.log(`\n[Score: ${file.srpScore}] ${file.filePath}`);
                console.log(`  - Analysis: ${file.srpAnalysis}`);
            });
        }
    }

    // --- EXTRACTION METHODS MOVED INSIDE THE CLASS ---
    private extractFunctions(content: string): any[] { return []; }
    private extractClasses(content: string): any[] { return []; }
    private extractExports(content: string): any[] { return []; }
    private extractImports(content: string): { module: string }[] {
        const importRegex = /import\s+.*\s+from\s+['"](.*?)['"];?/g;
        const matches = content.matchAll(importRegex);
        return Array.from(matches, m => ({ module: m[1] }));
    }
    private extractTopLevelVariables(content: string): any[] { return []; }
}

// --- SCRIPT EXECUTION ---
(function main() {
    console.log("Starting SRP analysis...");
    const scanner = new SRPScanner();
    scanner.scanDirectory(process.cwd());
    scanner.report();
    console.log("SRP analysis complete.");
})();