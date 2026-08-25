"use client";

import React, { useState, useEffect } from "react";
import { UserProfile, Garment, Outfit, AIConfig } from "@/types";
import { StorageService } from "@/lib/storage";
import { Navbar } from "@/components/layout/Navbar";
import { ClosetView } from "@/components/closet/ClosetView";
import { UploadModal } from "@/components/closet/UploadModal";
import { WardrobeStatsModal } from "@/components/closet/WardrobeStatsModal";
import { OutfitGenerator } from "@/components/stylist/OutfitGenerator";
import { StylistChat } from "@/components/chat/StylistChat";
import { LookbookView } from "@/components/lookbook/LookbookView";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import { SettingsModal } from "@/components/settings/SettingsModal";
import { Sparkles, Shirt, Wand2, MessageSquare, BookOpen, User, RefreshCw } from "lucide-react";

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("closet");
  
  // App state
  const [profile, setProfile] = useState<UserProfile>(StorageService.getProfile());
  const [garments, setGarments] = useState<Garment[]>([]);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [aiConfig, setAiConfig] = useState<AIConfig>({ provider: "auto" });

  // Modal states
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setProfile(StorageService.getProfile());
    setGarments(StorageService.getGarments());
    setOutfits(StorageService.getOutfits());
    setAiConfig(StorageService.getAIConfig());
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-charcoal-900">
          <Sparkles className="w-6 h-6 text-terracotta-500 animate-spin" />
          <span className="font-serif text-lg font-bold">Cargando tu Atelier Personal...</span>
        </div>
      </div>
    );
  }

  // Handlers
  const handleSaveGarment = (newGarment: Garment) => {
    const updated = StorageService.addGarment(newGarment);
    setGarments(updated);
  };

  const handleDeleteGarment = (id: string) => {
    const updated = StorageService.deleteGarment(id);
    setGarments(updated);
  };

  const handleIncrementWear = (garment: Garment) => {
    const updatedGarment = { ...garment, wearCount: (garment.wearCount || 0) + 1, lastWorn: new Date().toISOString() };
    const updated = StorageService.updateGarment(updatedGarment);
    setGarments(updated);
  };

  const handleSaveToLookbook = (outfit: Outfit) => {
    const updated = StorageService.saveOutfit(outfit);
    setOutfits(updated);
  };

  const handleToggleFavoriteOutfit = (id: string) => {
    const updated = StorageService.toggleFavoriteOutfit(id);
    setOutfits(updated);
  };

  const handleRateOutfit = (id: string, rating: number) => {
    const updated = StorageService.rateOutfit(id, rating);
    setOutfits(updated);
  };

  const handleCompleteOnboarding = (updatedProfile: UserProfile) => {
    StorageService.saveProfile(updatedProfile);
    setProfile(updatedProfile);
    setActiveTab("closet");
  };

  const handleSaveAIConfig = (newConfig: AIConfig) => {
    StorageService.saveAIConfig(newConfig);
    setAiConfig(newConfig);
  };

  const handleResetData = () => {
    StorageService.resetToDefaults();
    setProfile(StorageService.getProfile());
    setGarments(StorageService.getGarments());
    setOutfits(StorageService.getOutfits());
  };

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col font-sans selection:bg-terracotta-100 selection:text-terracotta-700">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        garmentCount={garments.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === "closet" && (
          <ClosetView
            garments={garments}
            onOpenUpload={() => setIsUploadOpen(true)}
            onDeleteGarment={handleDeleteGarment}
            onIncrementWear={handleIncrementWear}
          />
        )}

        {activeTab === "stylist" && (
          <OutfitGenerator
            garments={garments}
            profile={profile}
            aiConfig={aiConfig}
            onSaveToLookbook={handleSaveToLookbook}
            onToggleFavorite={handleToggleFavoriteOutfit}
            onRate={handleRateOutfit}
          />
        )}

        {activeTab === "chat" && (
          <StylistChat
            profile={profile}
            garments={garments}
            aiConfig={aiConfig}
          />
        )}

        {activeTab === "lookbook" && (
          <LookbookView
            outfits={outfits}
            onToggleFavorite={handleToggleFavoriteOutfit}
            onRate={handleRateOutfit}
            onNavigateToStylist={() => setActiveTab("stylist")}
          />
        )}

        {activeTab === "profile" && (
          <OnboardingWizard
            initialProfile={profile}
            onComplete={handleCompleteOnboarding}
            onCancel={() => setActiveTab("closet")}
          />
        )}
      </main>

      {/* Modals */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSave={handleSaveGarment}
        aiConfig={aiConfig}
      />

      <WardrobeStatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        garments={garments}
        profile={profile}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={aiConfig}
        onSaveConfig={handleSaveAIConfig}
        onResetData={handleResetData}
      />
    </div>
  );
}
