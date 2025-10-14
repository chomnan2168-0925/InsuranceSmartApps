import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

type AdSlotState = {
  code: string;
  enabled: boolean;
};

type AdSlots = {
  top: AdSlotState;
  bottom: AdSlotState;
  sidebar: AdSlotState;
  inpost: AdSlotState;
};

type AdSlotProps = {
  title: string;
  description: string;
  slotKey: keyof AdSlots;
  slot: AdSlotState;
  onChange: (slotKey: keyof AdSlots, newSlot: AdSlotState) => void;
};

const AdSlot: React.FC<AdSlotProps> = ({ title, description, slotKey, slot, onChange }) => {
  return (
    <div className="border-t pt-4 mt-4">
      <h4 className="text-lg font-semibold">{title}</h4>
      <p className="text-xs text-gray-500">{description}</p>
      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium">AdSense Code (HTML/JS)</label>
          <textarea
            rows={5}
            className="mt-1 w-full p-2 border rounded-md font-mono text-xs"
            placeholder="<script async src=...></script>"
            value={slot.code}
            onChange={(e) => onChange(slotKey, { ...slot, code: e.target.value })}
          />
        </div>

        {/* Toggle Switch */}
        <div className="space-y-4">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={slot.enabled}
              onChange={(e) => onChange(slotKey, { ...slot, enabled: e.target.checked })}
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-colors duration-200 relative">
              <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform peer-checked:translate-x-5 transition-transform duration-200"></div>
            </div>
            <span className="ml-3 text-sm font-medium">
              {slot.enabled ? 'Enabled' : 'Disabled'}
            </span>
          </label>

          <div>
            <p className="text-sm font-medium">Device Targeting</p>
            <div className="flex gap-4 mt-1 text-sm">
              <label>
                <input type="radio" name={`${title}-device`} defaultChecked /> Both
              </label>
              <label>
                <input type="radio" name={`${title}-device`} /> Desktop
              </label>
              <label>
                <input type="radio" name={`${title}-device`} /> Mobile
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdManagerTab: React.FC = () => {
  const [ads, setAds] = useState<AdSlots>({
    top: { code: '', enabled: true },
    bottom: { code: '', enabled: true },
    sidebar: { code: '', enabled: true },
    inpost: { code: '', enabled: true },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch ad settings from Supabase on component mount
  useEffect(() => {
    const fetchAdSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'ad_slots')
          .single();

        if (error) {
          console.error('Error fetching ad settings:', error);
        } else if (data && data.value) {
          setAds(data.value as AdSlots);
        }
      } catch (err) {
        console.error('Error loading ad settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdSettings();
  }, []);

  const handleChange = (slotKey: keyof AdSlots, newSlot: AdSlotState) => {
    setAds((prev) => ({ ...prev, [slotKey]: newSlot }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({ 
          value: ads,
          updated_at: new Date().toISOString()
        })
        .eq('key', 'ad_slots');

      if (error) {
        console.error('Error saving ad settings:', error);
        alert('Failed to save ad settings. Please try again.');
      } else {
        alert('Ad settings saved successfully!');
      }
    } catch (err) {
      console.error('Error saving ad settings:', err);
      alert('Failed to save ad settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-center text-gray-500">Loading ad settings...</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <h3 className="text-xl font-bold text-navy-blue">Ad Slot Management</h3>
      <p className="text-sm text-gray-600">
        Insert Google AdSense code into predefined slots in your website layout.
      </p>

      <AdSlot
        title="Top Banner"
        description="Appears at the very top of every page."
        slotKey="top"
        slot={ads.top}
        onChange={handleChange}
      />

      <AdSlot
        title="Bottom Banner"
        description="Appears at the bottom of every page, before the footer."
        slotKey="bottom"
        slot={ads.bottom}
        onChange={handleChange}
      />

      <AdSlot
        title="Sidebar Ad"
        description="Appears in the sidebar on pages that have one."
        slotKey="sidebar"
        slot={ads.sidebar}
        onChange={handleChange}
      />

      <AdSlot
        title="In-Post Ad"
        description="Appears in article content. Insert via shortcode: [ad_in_content]"
        slotKey="inpost"
        slot={ads.inpost}
        onChange={handleChange}
      />

      <div className="flex justify-end mt-6 border-t pt-4">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-gold text-navy-blue font-bold rounded-md hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Ad Settings'}
        </button>
      </div>
    </form>
  );
};

export default AdManagerTab;