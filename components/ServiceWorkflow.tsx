import { useState } from "react";
import { ArrowLeft, X, Check, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Service } from "../types";
import { workflows } from "../utils/workflows";
import { generateResult } from "../utils/results";

interface ServiceWorkflowProps {
  service: Service;
  onClose: () => void;
}

export function ServiceWorkflow({ service, onClose }: ServiceWorkflowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [result, setResult] = useState("");

  const steps = workflows[service.id] || [];
  const currentStepData = steps[currentStep];
  const currentAnswer = answers[currentStepData?.id] || "";

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [currentStepData.id]: value });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const generatedResult = generateResult(service.id, answers);
      setResult(generatedResult);
      setIsComplete(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setIsComplete(false);
    setCurrentStep(0);
    setAnswers({});
    setResult("");
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-cyan-500/20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10"
            >
              <ArrowLeft className="w-4 h-4 ml-2" />
              رجوع
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{service.icon}</span>
              <h1 className="text-lg font-bold text-white">{service.title}</h1>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-slate-400 hover:text-red-400 hover:bg-red-500/10"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto">
          {!isComplete ? (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
              {/* Progress */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">
                    الخطوة {currentStep + 1} من {steps.length}
                  </span>
                  <span className="text-sm text-cyan-400">
                    {Math.round(((currentStep + 1) / steps.length) * 100)}%
                  </span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question */}
              <div className="mb-6">
                <Label className="text-xl font-semibold text-white mb-4 block">
                  {currentStepData?.question}
                </Label>

                {currentStepData?.type === "text" && (
                  <Input
                    value={currentAnswer}
                    onChange={(e) => handleAnswer(e.target.value)}
                    placeholder={currentStepData.placeholder}
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500"
                  />
                )}

                {currentStepData?.type === "textarea" && (
                  <Textarea
                    value={currentAnswer}
                    onChange={(e) => handleAnswer(e.target.value)}
                    placeholder={currentStepData.placeholder}
                    rows={4}
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500"
                  />
                )}

                {currentStepData?.type === "select" && (
                  <div className="grid grid-cols-2 gap-3">
                    {currentStepData.options?.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleAnswer(option)}
                        className={`p-3 rounded-xl border text-right transition-all ${
                          currentAnswer === option
                            ? "bg-cyan-500/20 border-cyan-500 text-cyan-300"
                            : "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    السابق
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  disabled={!currentAnswer}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white disabled:opacity-50"
                >
                  {currentStep < steps.length - 1 ? "التالي" : "إنشاء النتيجة"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
              {/* Success Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">تم إنشاء النتيجة!</h2>
                  <p className="text-slate-400 text-sm">إليك ما قمت بإعداده لك</p>
                </div>
              </div>

              {/* Result */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 mb-6">
                <pre className="text-slate-200 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {result}
                </pre>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  البدء من جديد
                </Button>
                <Button
                  onClick={onClose}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white"
                >
                  <Sparkles className="w-4 h-4 ml-2" />
                  إنهاء
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}