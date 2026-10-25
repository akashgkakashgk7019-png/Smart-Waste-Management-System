import React, { useState, useEffect, useRef } from 'react';
import { Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { WASTE_CATEGORIES } from '../data/categories';
import { DistrictOption, HobliOption, CityOrTown } from '../types';
import {
  AlertCircle,
  MapPin,
  Camera,
  Upload,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Navigation,
  FileText,
  Phone,
  ShieldCheck,
  Sparkles,
  Info,
  Scale,
  Video,
  Plus,
  Compass,
  Search,
  X,
  RefreshCw,
  Circle,
  Square,
  Play,
  Image as ImageIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BackButton } from '../components/BackButton';
import { TAB_NAMES } from '../App';

interface UploadedMedia {
  url: string;
  name: string;
  type: string;
}

const QUANTITY_BRACKETS = [
  { id: 'less-1kg', label: 'Less than 1 kg', approxKg: 0.8, vehicle: 'Handheld collection / Pourakarmika', desc: 'Single small bag of refuse or wrappers' },
  { id: '1-5kg', label: '1–5 kg', approxKg: 3, vehicle: 'Auto Tipper (Doorstep)', desc: '1 to 2 household daily dustbin bags' },
  { id: '6-10kg', label: '6–10 kg', approxKg: 8, vehicle: 'Auto Tipper (Compartment)', desc: 'Large shopping bag or filled carton' },
  { id: '11-25kg', label: '11–25 kg', approxKg: 18, vehicle: 'Auto Tipper / Mini Van', desc: 'Full gunny sack or small roadside pile' },
  { id: '26-50kg', label: '26–50 kg', approxKg: 38, vehicle: 'Mini Truck (Tata Ace)', desc: 'Medium street corner dump / commercial trash' },
  { id: '51-100kg', label: '51–100 kg', approxKg: 75, vehicle: 'Large Compactor Truck', desc: 'Substantial roadside blackspot heap' },
  { id: 'more-100kg', label: 'More than 100 kg', approxKg: 150, vehicle: 'Hydraulic Tipper & JCB Loader', desc: 'Heavy unauthorized dumping / C&D rubble' },
  { id: 'custom', label: 'Custom Quantity', approxKg: 20, vehicle: 'Dynamic Allocation', desc: 'Enter custom estimated weight in kg' }
];

export const ReportWastePage: React.FC<{
  setCurrentTab: (tab: string) => void;
  onBack?: () => void;
  previousTab?: string;
}> = ({ setCurrentTab, onBack, previousTab }) => {
  const { t, language } = useLanguage();
  const { user, openAuthModal } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [districtsData, setDistrictsData] = useState<DistrictOption[]>([]);
  const [categoriesList, setCategoriesList] = useState(WASTE_CATEGORIES);

  // Step 1: Waste Category
  const [wasteCategory, setWasteCategory] = useState<string>('Household Waste');

  // Step 2: Estimated Quantity
  const [selectedBracket, setSelectedBracket] = useState<string>('11-25kg');
  const [customKg, setCustomKg] = useState<number>(20);
  const [quantityKg, setQuantityKg] = useState<number>(18);

  // Step 3: Location (State → District → Taluk → Hobli → City/Town/Village → Area/Locality/Ward → Street/Road)
  const [state] = useState<string>('Karnataka');
  const [district, setDistrict] = useState<string>('Bengaluru Urban');
  const [taluk, setTaluk] = useState<string>('Bengaluru South');
  const [hobli, setHobli] = useState<string>('Begur Hobli');
  const [city, setCity] = useState<string>('BBMP South Zone');
  const [ward, setWard] = useState<string>('Ward 151 - Koramangala');
  const [street, setStreet] = useState<string>('');
  const [lat, setLat] = useState<number>(12.9344);
  const [lng, setLng] = useState<number>(77.6245);
  const [reverseGeocodedAddress, setReverseGeocodedAddress] = useState<string>('');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsMessage, setGpsMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Google Map Search & Manual Village entry states
  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const [isSearchingMap, setIsSearchingMap] = useState(false);
  const [mapSearchResults, setMapSearchResults] = useState<any[]>([]);
  const [mapSearchFeedback, setMapSearchFeedback] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isManualVillage, setIsManualVillage] = useState(false);
  const [manualVillage, setManualVillage] = useState('');
  const [isManualWard, setIsManualWard] = useState(false);
  const [manualWard, setManualWard] = useState('');

  // Detailed Pinned Address Details from Google Maps reverse-geocoding
  interface PinnedAddressDetails {
    formatted_address: string;
    street: string;
    area: string;
    taluk: string;
    district: string;
    state: string;
    postalCode: string;
    lat: number;
    lng: number;
    timestamp: string;
  }
  const [pinnedAddressDetails, setPinnedAddressDetails] = useState<PinnedAddressDetails | null>(null);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const [addressAppliedNotice, setAddressAppliedNotice] = useState(false);
  const [villageFilterMode, setVillageFilterMode] = useState<'hobli' | 'all'>('hobli');

  // Step 4: Photos / Videos
  const [attachments, setAttachments] = useState<UploadedMedia[]>([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Live Camera & Video Recording States
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [cameraMode, setCameraMode] = useState<'photo' | 'video'>('photo');
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);
  const [recordedVideoBlob, setRecordedVideoBlob] = useState<Blob | null>(null);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [cameraInitializing, setCameraInitializing] = useState(false);

  const videoStreamRef = useRef<MediaStream | null>(null);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);

  // Step 5: Description
  const [description, setDescription] = useState<string>('');

  // Step 6: Contact
  const [mobile, setMobile] = useState<string>(user?.mobile || '');

  // Step 8: Submission Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submittedComplaintId, setSubmittedComplaintId] = useState<string | null>(null);

  // Inline Validation Errors
  const [stepErrors, setStepErrors] = useState<{ [key: string]: string }>({});

  // Load locations from backend
  useEffect(() => {
    fetch('/api/locations')
      .then(res => res.json())
      .then(data => {
        if (data.districts && data.districts.length > 0) {
          setDistrictsData(data.districts);
        }
      })
      .catch(err => console.error('Failed to load Karnataka locations:', err));

    // Load dynamic categories
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.categories && data.categories.length > 0) {
          // Merge with detailed descriptions from WASTE_CATEGORIES
          const merged = data.categories.map((c: any) => {
            const match = WASTE_CATEGORIES.find(w => w.name === c.name || w.id === c.id);
            return match || {
              id: c.id,
              name: c.name,
              kannadaName: c.name,
              hindiName: c.name,
              binColor: c.binColor || 'Standard Bin',
              binHex: c.binHex || '#10B981',
              description: c.description || 'Civic waste category in Karnataka.',
              examples: [],
              segregationMethod: 'Segregate carefully at source.',
              doNotMix: [],
              safeHandling: 'Keep in designated bins.',
              recyclingMethod: 'Hand over to authorized ULB conservancy team.',
              municipalDisclaimer: 'Regulated under Karnataka Solid Waste Management Rules.'
            };
          });
          setCategoriesList(merged);
        }
      })
      .catch(err => console.error('Failed to load categories:', err));
  }, []);

  // Update contact when user signs in
  useEffect(() => {
    if (user?.mobile) setMobile(user.mobile);
  }, [user]);

  // Handle quantity changes
  const handleBracketChange = (bracketId: string) => {
    setSelectedBracket(bracketId);
    const bracket = QUANTITY_BRACKETS.find(b => b.id === bracketId);
    if (bracket) {
      if (bracketId === 'custom') {
        setQuantityKg(customKg);
      } else {
        setQuantityKg(bracket.approxKg);
      }
    }
  };

  const handleCustomKgChange = (val: number) => {
    setCustomKg(val);
    setQuantityKg(val);
  };

  // Cascading Location Handlers
  const handleDistrictChange = (dName: string) => {
    setDistrict(dName);
    const foundDist = districtsData.find(d => d.name === dName);
    if (foundDist && foundDist.taluks.length > 0) {
      const firstTaluk = foundDist.taluks[0];
      setTaluk(firstTaluk.name);

      if (firstTaluk.hoblis && firstTaluk.hoblis.length > 0) {
        setHobli(firstTaluk.hoblis[0].name);
        if (firstTaluk.hoblis[0].cities.length > 0) {
          setCity(firstTaluk.hoblis[0].cities[0].name);
          if (firstTaluk.hoblis[0].cities[0].wards.length > 0) {
            setWard(firstTaluk.hoblis[0].cities[0].wards[0]);
          }
        }
      } else if (firstTaluk.cities && firstTaluk.cities.length > 0) {
        setHobli('Kasaba Hobli');
        setCity(firstTaluk.cities[0].name);
        if (firstTaluk.cities[0].wards.length > 0) {
          setWard(firstTaluk.cities[0].wards[0]);
        }
      }
    }
  };

  const handleTalukChange = (tName: string) => {
    setTaluk(tName);
    const foundDist = districtsData.find(d => d.name === district);
    const foundTaluk = foundDist?.taluks.find(t => t.name === tName);
    if (foundTaluk) {
      if (foundTaluk.hoblis && foundTaluk.hoblis.length > 0) {
        setHobli(foundTaluk.hoblis[0].name);
        if (foundTaluk.hoblis[0].cities.length > 0) {
          setCity(foundTaluk.hoblis[0].cities[0].name);
          if (foundTaluk.hoblis[0].cities[0].wards.length > 0) {
            setWard(foundTaluk.hoblis[0].cities[0].wards[0]);
          }
        }
      } else if (foundTaluk.cities && foundTaluk.cities.length > 0) {
        setHobli('Kasaba Hobli');
        setCity(foundTaluk.cities[0].name);
        if (foundTaluk.cities[0].wards.length > 0) {
          setWard(foundTaluk.cities[0].wards[0]);
        }
      }
    }
  };

  const handleHobliChange = (hName: string) => {
    setHobli(hName);
    const foundDist = districtsData.find(d => d.name === district);
    const foundTaluk = foundDist?.taluks.find(t => t.name === taluk);
    const foundHobli = foundTaluk?.hoblis?.find(h => h.name === hName);
    if (foundHobli && foundHobli.cities.length > 0) {
      setCity(foundHobli.cities[0].name);
      if (foundHobli.cities[0].wards.length > 0) {
        setWard(foundHobli.cities[0].wards[0]);
      }
    }
  };

  const handleCityChange = (cName: string) => {
    setCity(cName);
    const foundDist = districtsData.find(d => d.name === district);
    const foundTaluk = foundDist?.taluks.find(t => t.name === taluk);
    const foundHobli = foundTaluk?.hoblis?.find(h => h.name === hobli);
    const targetCities = foundHobli?.cities || foundTaluk?.cities || [];
    const foundCity = targetCities.find(c => c.name === cName);
    if (foundCity && foundCity.wards.length > 0) {
      setWard(foundCity.wards[0]);
    }
  };

  // Reverse Geocoding helper with full address details extraction & form synchronization
  const handleReverseGeocode = async (latitude: number, longitude: number, isFromGPS: boolean = false) => {
    setIsFetchingAddress(true);
    setAddressAppliedNotice(false);
    try {
      const res = await fetch(`/api/locations/reverse-geocode?lat=${latitude}&lng=${longitude}`);
      const data = await res.json();
      if (res.ok && data.success) {
        const details: PinnedAddressDetails = {
          formatted_address: data.formatted_address || `${latitude}, ${longitude}`,
          street: data.street || '',
          area: data.area || '',
          taluk: data.taluk || '',
          district: data.district || '',
          state: data.state || 'Karnataka',
          postalCode: data.postalCode || '',
          lat: latitude,
          lng: longitude,
          timestamp: new Date().toLocaleTimeString()
        };
        setPinnedAddressDetails(details);
        setReverseGeocodedAddress(details.formatted_address);

        // Auto-update street field with exact street/landmark
        if (details.street) {
          setStreet(details.street);
          if (stepErrors.street) setStepErrors(prev => ({ ...prev, street: '' }));
        } else if (details.formatted_address) {
          const firstPart = details.formatted_address.split(',')[0];
          if (firstPart) {
            setStreet(firstPart);
            if (stepErrors.street) setStepErrors(prev => ({ ...prev, street: '' }));
          }
        }

        // Auto-update Ward / Locality if area returned
        if (details.area) {
          setWard(details.area);
          setManualWard(details.area);
          setIsManualWard(true);
        }

        // Auto-match Karnataka District
        if (details.district) {
          const rawDist = details.district.toLowerCase();
          const matchedDist = districtsData.find(d => {
            const dLower = d.name.toLowerCase();
            return (
              dLower.includes(rawDist) ||
              rawDist.includes(dLower) ||
              (rawDist.includes('bangalore') && dLower.includes('bengaluru')) ||
              (rawDist.includes('bengaluru') && dLower.includes('bengaluru')) ||
              (rawDist.includes('mysore') && dLower.includes('mysuru')) ||
              (rawDist.includes('belgaum') && dLower.includes('belagavi')) ||
              (rawDist.includes('bellary') && dLower.includes('ballari')) ||
              (rawDist.includes('gulbarga') && dLower.includes('kalaburagi')) ||
              (rawDist.includes('bijapur') && dLower.includes('vijayapura')) ||
              (rawDist.includes('shimoga') && dLower.includes('shivamogga'))
            );
          });
          if (matchedDist) {
            setDistrict(matchedDist.name);
            // Auto-match Taluk under that district
            if (details.taluk) {
              const rawTaluk = details.taluk.toLowerCase();
              const matchedTaluk = matchedDist.taluks.find(t =>
                t.name.toLowerCase().includes(rawTaluk) || rawTaluk.includes(t.name.toLowerCase())
              );
              if (matchedTaluk) {
                setTaluk(matchedTaluk.name);
                if (matchedTaluk.hoblis && matchedTaluk.hoblis.length > 0) {
                  setHobli(matchedTaluk.hoblis[0].name);
                }
              }
            }
          }
        }

        setAddressAppliedNotice(true);
        setGpsMessage({
          text: `${isFromGPS ? '✓ Current Location fetched' : '✓ Pinned location fetched'}: ${details.formatted_address}`,
          type: 'success'
        });
      } else {
        setGpsMessage({
          text: `Pinned at ${latitude}° N, ${longitude}° E. Note: ${data.error_message || 'Address detail unavailable, please enter street details manually.'}`,
          type: 'info'
        });
      }
    } catch (err) {
      console.warn('Reverse geocode could not be fetched:', err);
      setGpsMessage({
        text: `Pinned at ${latitude}° N, ${longitude}° E. Address details could not be resolved.`,
        type: 'info'
      });
    } finally {
      setIsFetchingAddress(false);
    }
  };

  // Re-apply pinned address details to form fields
  const applyAddressDetailsToForm = () => {
    if (!pinnedAddressDetails) return;
    if (pinnedAddressDetails.street) {
      setStreet(pinnedAddressDetails.street);
      if (stepErrors.street) setStepErrors(prev => ({ ...prev, street: '' }));
    } else if (pinnedAddressDetails.formatted_address) {
      const firstPart = pinnedAddressDetails.formatted_address.split(',')[0];
      if (firstPart) setStreet(firstPart);
    }
    if (pinnedAddressDetails.area) {
      setWard(pinnedAddressDetails.area);
      setManualWard(pinnedAddressDetails.area);
      setIsManualWard(true);
    }
    setAddressAppliedNotice(true);
  };

  // GPS Current Location Detection with High Accuracy & Immediate Address Detail Fetch
  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGpsMessage({ text: 'GPS Geolocation is not supported by your current browser.', type: 'error' });
      return;
    }
    setGpsLoading(true);
    setGpsMessage({ text: 'Connecting to device GPS satellites & cell tower coordinates...', type: 'info' });

    navigator.geolocation.getCurrentPosition(
      pos => {
        const detectedLat = parseFloat(pos.coords.latitude.toFixed(5));
        const detectedLng = parseFloat(pos.coords.longitude.toFixed(5));
        setLat(detectedLat);
        setLng(detectedLng);
        setGpsLoading(false);
        setGpsMessage({
          text: `Live GPS fix acquired: ${detectedLat}° N, ${detectedLng}° E (accuracy: ±${Math.round(pos.coords.accuracy)}m). Fetching address...`,
          type: 'success'
        });
        handleReverseGeocode(detectedLat, detectedLng, true);
      },
      err => {
        setGpsLoading(false);
        let errorMsg = 'Could not acquire GPS fix.';
        if (err.code === 1) {
          errorMsg = 'Location permission was denied. Please allow location access in your browser or click directly on the Google Map to pin coordinates.';
        } else if (err.code === 2) {
          errorMsg = 'Position unavailable. GPS satellites unreachable; manual map pin selection is available.';
        } else if (err.code === 3) {
          errorMsg = 'GPS location request timed out. Please try again or tap your street on the map.';
        }
        setGpsMessage({ text: errorMsg, type: 'error' });
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
    );
  };

  // Google Map Place & Keyword Search Handler
  const handleSearchOnMap = async (customQuery?: string) => {
    const q = (customQuery || mapSearchQuery).trim();
    if (!q) return;

    setIsSearchingMap(true);
    setMapSearchFeedback(null);
    try {
      const res = await fetch(`/api/locations/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (res.ok && data.results && data.results.length > 0) {
        setMapSearchResults(data.results);
        const top = data.results[0];
        const newLat = parseFloat(Number(top.lat).toFixed(5));
        const newLng = parseFloat(Number(top.lng).toFixed(5));
        setLat(newLat);
        setLng(newLng);
        setReverseGeocodedAddress(top.formatted_address);

        // Auto-match District & Taluk if returned
        if (top.district) {
          const matched = districtsData.find(
            d => d.name.toLowerCase().includes(top.district.toLowerCase()) || top.district.toLowerCase().includes(d.name.toLowerCase())
          );
          if (matched) {
            setDistrict(matched.name);
            if (top.taluk) {
              const matchedTaluk = matched.taluks.find(
                t => t.name.toLowerCase().includes(top.taluk.toLowerCase()) || top.taluk.toLowerCase().includes(t.name.toLowerCase())
              );
              if (matchedTaluk) setTaluk(matchedTaluk.name);
            }
          }
        }

        if (top.street && !street) {
          setStreet(top.street);
        }

        setMapSearchFeedback({
          text: `Found and pinned: ${top.formatted_address}`,
          type: 'success'
        });
      } else {
        setMapSearchResults([]);
        setMapSearchFeedback({
          text: `No exact coordinates found for '${q}'. Try adding Karnataka district/taluk or click directly on the map.`,
          type: 'error'
        });
      }
    } catch (err: any) {
      setMapSearchFeedback({
        text: 'Map search request failed. You can click on the map directly.',
        type: 'error'
      });
    } finally {
      setIsSearchingMap(false);
    }
  };

  const handleSelectSearchResult = (result: any) => {
    const newLat = parseFloat(Number(result.lat).toFixed(5));
    const newLng = parseFloat(Number(result.lng).toFixed(5));
    setLat(newLat);
    setLng(newLng);
    setReverseGeocodedAddress(result.formatted_address);
    setMapSearchResults([]);
    setMapSearchFeedback({
      text: `Pinned on Google Map: ${result.formatted_address}`,
      type: 'success'
    });
    handleReverseGeocode(newLat, newLng);
  };

  // Manual Village Handler & Google Map locator
  const handleManualVillageChange = (val: string) => {
    setManualVillage(val);
    setCity(val);
  };

  const handleLocateVillageOnMap = () => {
    if (!manualVillage.trim()) return;
    const query = `${manualVillage.trim()}, ${taluk}, ${district}, Karnataka`;
    setMapSearchQuery(query);
    handleSearchOnMap(query);
  };

  const handleManualWardChange = (val: string) => {
    setManualWard(val);
    setWard(val);
  };

  // File Upload Handler (Photos & Videos with validation)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (attachments.length >= 5) {
      setUploadError('Maximum limit of 5 media evidence files reached.');
      return;
    }

    setUploadError('');
    setUploadLoading(true);
    const file = files[0];

    // Max 15MB
    if (file.size > 15 * 1024 * 1024) {
      setUploadLoading(false);
      setUploadError('File size exceeds 15MB limit. Please compress photo or video before uploading.');
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'video/mp4', 'video/webm'];
    if (!validTypes.includes(file.type)) {
      setUploadLoading(false);
      setUploadError('Only JPEG, PNG, WEBP images and MP4, WEBM videos are allowed.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: base64,
            filename: file.name,
            type: file.type
          })
        });
        const data = await res.json();
        if (res.ok) {
          setAttachments(prev => [...prev, { url: data.url, name: data.name, type: data.type }]);
        } else {
          setUploadError(data.error || 'Failed to upload media file');
        }
      } catch (err: any) {
        setUploadError(err.message || 'Media upload failed');
      } finally {
        setUploadLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Camera stream cleanup helper
  const stopCameraStream = () => {
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach(track => track.stop());
      videoStreamRef.current = null;
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  };

  // Initialize browser camera/microphone
  const initCamera = async (mode: 'photo' | 'video', facing: 'environment' | 'user') => {
    stopCameraStream();
    setCameraError(null);
    setCameraInitializing(true);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera and video recording is not supported in this browser. Please use the Upload button to select files.');
      setCameraInitializing(false);
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: mode === 'video'
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoStreamRef.current = stream;

      if (videoElementRef.current) {
        videoElementRef.current.srcObject = stream;
        videoElementRef.current.play().catch(e => console.warn('Video play warning:', e));
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      let msg = 'Failed to access device camera.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = 'Camera permission was denied. Please allow camera and microphone access in your browser settings to take live evidence.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        msg = 'No camera or microphone hardware found on this device.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        msg = 'Camera hardware is currently in use by another application.';
      }
      setCameraError(msg);
    } finally {
      setCameraInitializing(false);
    }
  };

  const openCameraModal = (mode: 'photo' | 'video') => {
    if (attachments.length >= 5) {
      setUploadError('Maximum limit of 5 media evidence files reached.');
      return;
    }
    setCameraMode(mode);
    setCapturedPhotoUrl(null);
    setRecordedVideoBlob(null);
    setRecordedVideoUrl(null);
    setIsRecordingVideo(false);
    setRecordingSeconds(0);
    setIsCameraModalOpen(true);
    setTimeout(() => {
      initCamera(mode, cameraFacing);
    }, 150);
  };

  const closeCameraModal = () => {
    stopCameraStream();
    setIsCameraModalOpen(false);
    setCapturedPhotoUrl(null);
    setRecordedVideoBlob(null);
    setRecordedVideoUrl(null);
    setIsRecordingVideo(false);
    setRecordingSeconds(0);
    setCameraError(null);
  };

  const toggleCameraFacing = () => {
    const nextFacing = cameraFacing === 'environment' ? 'user' : 'environment';
    setCameraFacing(nextFacing);
    initCamera(cameraMode, nextFacing);
  };

  // Capture Live Photo
  const captureLivePhoto = () => {
    if (!videoElementRef.current) return;
    const video = videoElementRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedPhotoUrl(dataUrl);
    stopCameraStream();
  };

  const retakePhoto = () => {
    setCapturedPhotoUrl(null);
    initCamera('photo', cameraFacing);
  };

  const confirmUploadPhoto = async () => {
    if (!capturedPhotoUrl) return;
    setUploadLoading(true);
    setUploadError('');
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: capturedPhotoUrl,
          filename: `live-photo-${Date.now()}.jpg`,
          type: 'image/jpeg'
        })
      });
      const data = await res.json();
      if (res.ok) {
        setAttachments(prev => [...prev, { url: data.url, name: data.name, type: data.type }]);
        closeCameraModal();
      } else {
        setUploadError(data.error || 'Failed to upload captured photo');
      }
    } catch (err: any) {
      setUploadError(err.message || 'Photo upload failed');
    } finally {
      setUploadLoading(false);
    }
  };

  // Video Recording
  const startVideoRecording = () => {
    if (!videoStreamRef.current) return;
    recordedChunksRef.current = [];
    setRecordingSeconds(0);

    try {
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
        ? 'video/webm;codecs=vp9,opus'
        : MediaRecorder.isTypeSupported('video/webm')
        ? 'video/webm'
        : 'video/mp4';

      const recorder = new MediaRecorder(videoStreamRef.current, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: recorder.mimeType || 'video/webm' });
        setRecordedVideoBlob(blob);
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
        stopCameraStream();
      };

      recorder.start(500); // 500ms slices
      setIsRecordingVideo(true);

      // 60-second maximum recording timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(prev => {
          if (prev >= 60) {
            stopVideoRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      setCameraError('Could not initialize video recording: ' + err.message);
    }
  };

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecordingVideo(false);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  };

  const retakeVideo = () => {
    if (recordedVideoUrl) {
      URL.revokeObjectURL(recordedVideoUrl);
    }
    setRecordedVideoBlob(null);
    setRecordedVideoUrl(null);
    setRecordingSeconds(0);
    initCamera('video', cameraFacing);
  };

  const confirmUploadVideo = async () => {
    if (!recordedVideoBlob) return;
    setUploadLoading(true);
    setUploadError('');

    // Convert Blob to Base64
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: base64,
            filename: `live-video-${Date.now()}.webm`,
            type: recordedVideoBlob.type || 'video/webm'
          })
        });
        const data = await res.json();
        if (res.ok) {
          setAttachments(prev => [...prev, { url: data.url, name: data.name, type: data.type }]);
          closeCameraModal();
        } else {
          setUploadError(data.error || 'Failed to upload recorded video');
        }
      } catch (err: any) {
        setUploadError(err.message || 'Video upload failed');
      } finally {
        setUploadLoading(false);
      }
    };
    reader.readAsDataURL(recordedVideoBlob);
  };

  // Clean up stream on unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
      if (recordedVideoUrl) {
        URL.revokeObjectURL(recordedVideoUrl);
      }
    };
  }, []);

  // Step Validation logic
  const validateStep = (stepNum: number): boolean => {
    const errors: { [key: string]: string } = {};

    if (stepNum === 3) {
      if (!street.trim()) {
        errors.street = 'Street Name / Landmark is required so municipal tipper drivers can reach the spot.';
      }
    }

    if (stepNum === 5) {
      if (!description.trim()) {
        errors.description = 'Please provide a description of the waste problem (minimum 10 characters).';
      } else if (description.trim().length < 10) {
        errors.description = 'Description is too short. Please write at least 10 characters.';
      }
    }

    if (stepNum === 6) {
      const cleanPhone = mobile.replace(/[^0-9]/g, '');
      if (!cleanPhone) {
        errors.mobile = 'A valid 10-digit mobile number is required for verification updates.';
      } else if (cleanPhone.length !== 10) {
        errors.mobile = 'Please enter a complete 10-digit Indian mobile number.';
      }
    }

    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // Final Submit to backend
  const handleSubmitComplaint = async () => {
    if (!user) {
      openAuthModal('login');
      return;
    }

    if (!validateStep(3) || !validateStep(5) || !validateStep(6)) {
      setSubmitError('Please complete all required fields correctly before submitting.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const token = localStorage.getItem('smartwaste_token');
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          wasteCategory,
          quantityKg,
          quantityBracket: selectedBracket,
          description: description.trim(),
          state,
          district,
          taluk,
          hobli,
          city,
          ward,
          street: street.trim(),
          lat,
          lng,
          mobile: mobile.trim(),
          attachments
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || 'Failed to record complaint in database.');
      } else {
        setSubmittedComplaintId(data.complaint.id);
        setCurrentStep(8);
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Network error while submitting complaint to municipal server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dynamic cascading object finders
  const currentDistObj = districtsData.find(d => d.name === district);
  const currentTalukObj = currentDistObj?.taluks.find(t => t.name === taluk);
  const currentHobliObj = currentTalukObj?.hoblis?.find(h => h.name === hobli);

  // Collect all villages under this taluk across all hoblis + direct cities
  const allTalukVillages: CityOrTown[] = React.useMemo(() => {
    if (!currentTalukObj) return [];
    const list: CityOrTown[] = [];
    const seen = new Set<string>();

    if (currentTalukObj.hoblis) {
      for (const h of currentTalukObj.hoblis) {
        for (const c of h.cities || []) {
          if (!seen.has(c.name)) {
            seen.add(c.name);
            list.push(c);
          }
        }
      }
    }
    if (currentTalukObj.cities) {
      for (const c of currentTalukObj.cities) {
        if (!seen.has(c.name)) {
          seen.add(c.name);
          list.push(c);
        }
      }
    }
    return list;
  }, [currentTalukObj]);

  const currentAvailableCities: CityOrTown[] =
    villageFilterMode === 'all'
      ? (allTalukVillages.length > 0 ? allTalukVillages : (currentHobliObj?.cities || []))
      : (currentHobliObj?.cities && currentHobliObj.cities.length > 0 ? currentHobliObj.cities : allTalukVillages);
  const currentCityObj = currentAvailableCities.find(c => c.name === city);

  const stepsList = [
    { num: 1, title: t.stepCategory },
    { num: 2, title: t.stepQuantity },
    { num: 3, title: t.stepLocation },
    { num: 4, title: t.stepMedia },
    { num: 5, title: t.stepDescription },
    { num: 6, title: t.stepContact },
    { num: 7, title: t.stepReview },
    { num: 8, title: language === 'kn' ? 'ದೃಢೀಕರಣ' : language === 'hi' ? 'पुष्टि' : 'Confirmation' }
  ];

  const handleStepByStepBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (onBack) {
        onBack();
      } else {
        setCurrentTab(previousTab || 'home');
      }
    }
  };

  const previousTabName = previousTab ? TAB_NAMES[previousTab]?.[language as 'en' | 'kn' | 'hi'] || previousTab : undefined;

  const topBackLabel =
    currentStep > 1
      ? language === 'kn'
        ? `← ಹಿಂದಿನ ಹಂತ ${currentStep - 1} (${stepsList[currentStep - 2]?.title})`
        : language === 'hi'
        ? `← पिछला चरण ${currentStep - 1} (${stepsList[currentStep - 2]?.title})`
        : `← Back to Step ${currentStep - 1} (${stepsList[currentStep - 2]?.title})`
      : previousTabName
      ? language === 'kn'
        ? `← ಹಿಂದಿನ ಪುಟ (${previousTabName})`
        : language === 'hi'
        ? `← पिछला पृष्ठ (${previousTabName})`
        : `← Back to ${previousTabName}`
      : undefined;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Navigation Bar with Step-by-Step Back Button */}
      <div className="flex items-center justify-between">
        <BackButton
          onClick={handleStepByStepBack}
          label={topBackLabel}
          previousTabName={currentStep === 1 ? previousTabName : undefined}
          setCurrentTab={setCurrentTab}
          fallbackTab={previousTab || 'home'}
        />
        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
          Step {currentStep} of 8 · Karnataka ULB Grievance Portal
        </span>
      </div>

      {/* Title */}
      <div className="text-center space-y-1">
        <span className="text-xs uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
          {t.reportPageBadge}
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
          {t.reportPageTitle}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          {t.reportPageSubtitle}
        </p>
      </div>

      {/* Step Indicator Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between overflow-x-auto gap-2 pb-1 text-xs">
          {stepsList.map(s => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <div key={s.num} className="flex items-center gap-1.5 shrink-0">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-emerald-800 text-white ring-2 ring-emerald-600/30'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {isCompleted ? '✓' : s.num}
                </span>
                <span className={`text-[11px] font-semibold ${isCurrent ? 'text-emerald-900' : 'text-slate-500'}`}>
                  {s.title}
                </span>
                {s.num < 8 && <span className="text-slate-300 ml-1">·</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content Container */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        {/* STEP 1: Waste Category */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase">Step 1 of 8</span>
                <h3 className="text-lg font-bold text-slate-900">Select Waste Category *</h3>
                <p className="text-xs text-slate-500">Choose the primary type of waste accumulating at the problem location.</p>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                {categoriesList.length} Categories Available
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {categoriesList.map(cat => {
                const isSelected = wasteCategory === cat.name;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setWasteCategory(cat.name)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-600/20 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white"
                        style={{ backgroundColor: cat.binHex || '#10B981' }}
                      >
                        {cat.binColor?.split(' ')[0] || 'Standard'}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
                    </div>
                    <span className="text-xs font-bold text-slate-900 block">
                      {language === 'kn' ? cat.kannadaName : language === 'hi' ? cat.hindiName : cat.name}
                    </span>
                    <span className="text-[11px] text-emerald-800 font-medium line-clamp-1">
                      {language === 'en' ? `${cat.kannadaName || ''}` : cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Estimated Waste Quantity */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase">Step 2 of 8</span>
              <h3 className="text-lg font-bold text-slate-900">Estimated Waste Quantity *</h3>
              <p className="text-xs text-slate-500">
                Select the approximate waste weight range to dispatch the appropriate municipal clearance vehicle.
              </p>
            </div>

            {/* Quantity Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {QUANTITY_BRACKETS.map(b => {
                const isSelected = selectedBracket === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => handleBracketChange(b.id)}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/90 ring-2 ring-emerald-600/20 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black text-slate-900">{b.label}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">{b.desc}</p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center gap-1.5 text-[10px] font-semibold text-emerald-800">
                      <Scale className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="truncate">{b.vehicle}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom input if custom selected */}
            {selectedBracket === 'custom' && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Specify Estimated Weight (kg):
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max="5000"
                    value={customKg}
                    onChange={e => handleCustomKgChange(Math.max(1, Number(e.target.value)))}
                    className="w-36 p-2 text-sm font-bold font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
                  />
                  <span className="text-xs text-slate-500">
                    Kilograms (kg). Our control room will allocate the vehicle according to capacity.
                  </span>
                </div>
              </div>
            )}

            {/* Current Selected Summary Bar */}
            <div className="p-4 rounded-xl bg-emerald-900 text-white flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-800 flex items-center justify-center">
                  <Scale className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <span className="text-slate-300 block text-[10px] uppercase font-bold tracking-wider">
                    Assigned Estimation
                  </span>
                  <span className="font-bold text-sm text-emerald-200 font-mono">
                    ~{quantityKg} kg ({QUANTITY_BRACKETS.find(b => b.id === selectedBracket)?.label})
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-medium text-emerald-300 hidden sm:inline">
                {QUANTITY_BRACKETS.find(b => b.id === selectedBracket)?.vehicle}
              </span>
            </div>
          </div>
        )}

        {/* STEP 3: Karnataka Location Selection & Google Maps */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase">Step 3 of 8</span>
              <h3 className="text-lg font-bold text-slate-900">Karnataka Location & Google Map *</h3>
              <p className="text-xs text-slate-500">
                Select Karnataka administrative hierarchy (State → District → Taluk → Hobli → City → Ward) and pin the exact street coordinates on Google Maps.
              </p>
            </div>

            {/* GPS Auto-Detect Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-gradient-to-r from-emerald-900 to-slate-900 text-white shadow-md border border-emerald-700">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    Live GPS Device Geolocation & Address Fetch:
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-300 text-[11px]">Coordinates:</span>
                  <span className="font-mono text-emerald-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-xs font-semibold">
                    {lat}° N, {lng}° E
                  </span>
                  <span className="text-[10px] text-slate-400 hidden sm:inline">
                    · Automatically fetches street, ward, taluk & address details
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={detectCurrentLocation}
                disabled={gpsLoading}
                className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0 shadow-md ring-2 ring-emerald-400/30"
              >
                <Compass className={`w-4 h-4 text-white ${gpsLoading ? 'animate-spin' : ''}`} />
                <span>{gpsLoading ? 'Acquiring GPS Satellite Fix...' : '📍 Use My Current Location'}</span>
              </button>
            </div>

            {gpsMessage && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                  gpsMessage.type === 'error'
                    ? 'bg-red-50 border-red-200 text-red-700'
                    : gpsMessage.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-blue-50 border-blue-200 text-blue-700'
                }`}
              >
                <Info className="w-4 h-4 shrink-0" />
                <span>{gpsMessage.text}</span>
              </div>
            )}

            {/* Google Map Search Bar */}
            <div className="space-y-2 p-3.5 rounded-xl bg-slate-900 text-white shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Search className="w-4 h-4 text-emerald-400" />
                  Search Location, Village, Street or Landmark on Google Map:
                </span>
                <span className="text-[10px] text-slate-400">All Karnataka Districts</span>
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={mapSearchQuery}
                    onChange={e => setMapSearchQuery(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSearchOnMap();
                      }
                    }}
                    placeholder="Search e.g. Hampi UNESCO, Koramangala, Gokarna Beach, Ilkal Market, Badami, Bidar Fort..."
                    className="w-full pl-9 pr-8 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  {mapSearchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setMapSearchQuery('');
                        setMapSearchResults([]);
                        setMapSearchFeedback(null);
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleSearchOnMap()}
                  disabled={isSearchingMap || !mapSearchQuery.trim()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
                >
                  {isSearchingMap ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                  <span>{isSearchingMap ? 'Searching...' : 'Search Map'}</span>
                </button>
              </div>

              {/* Quick Search Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-[11px]">
                <span className="text-slate-400 text-[10px]">Popular:</span>
                {[
                  'Hampi UNESCO Heritage',
                  'Koramangala 4th Block',
                  'Mysuru Palace',
                  'Gokarna Car Street',
                  'Ilkal Saree Market',
                  'Badami Cave Temples',
                  'Bidar Fort Area',
                  'Chitradurga Fort'
                ].map(spot => (
                  <button
                    key={spot}
                    type="button"
                    onClick={() => {
                      setMapSearchQuery(spot);
                      handleSearchOnMap(spot);
                    }}
                    className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-emerald-950 text-slate-300 hover:text-emerald-300 border border-slate-700 text-[10px] transition-colors cursor-pointer"
                  >
                    {spot}
                  </button>
                ))}
              </div>

              {/* Search Feedback */}
              {mapSearchFeedback && (
                <div
                  className={`p-2 rounded-lg text-xs flex items-center gap-1.5 ${
                    mapSearchFeedback.type === 'success'
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                      : 'bg-red-950/80 text-red-300 border border-red-800'
                  }`}
                >
                  <Info className="w-3.5 h-3.5 shrink-0" />
                  <span>{mapSearchFeedback.text}</span>
                </div>
              )}

              {/* Multiple Search Results Selector */}
              {mapSearchResults.length > 1 && (
                <div className="p-2 bg-slate-800 rounded-lg border border-slate-700 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Multiple matching locations found (Click to pin on map):
                  </span>
                  <div className="max-h-32 overflow-y-auto space-y-1 pr-1">
                    {mapSearchResults.map((r, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectSearchResult(r)}
                        className="w-full text-left p-1.5 rounded hover:bg-slate-700 text-[11px] text-slate-200 flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <span className="truncate mr-2">{r.formatted_address}</span>
                        <span className="text-[10px] font-mono text-emerald-400 shrink-0 font-bold">Pin &rarr;</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Interactive Google Map */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  Interactive Google Map Marker (Click anywhere or drag marker to set exact spot):
                </span>
                <span className="text-[11px] text-slate-500">Auto-updates road address</span>
              </div>

              <div className="w-full h-72 sm:h-80 rounded-xl overflow-hidden border border-slate-300 relative shadow-inner">
                <Map
                  style={{ width: '100%', height: '100%' }}
                  defaultCenter={{ lat: 12.9716, lng: 77.5946 }}
                  center={{ lat, lng }}
                  zoom={15}
                  mapId="DEMO_MAP_ID"
                  internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
                  gestureHandling="greedy"
                  onClick={(e) => {
                    if (e.detail.latLng) {
                      const newLat = parseFloat(e.detail.latLng.lat.toFixed(5));
                      const newLng = parseFloat(e.detail.latLng.lng.toFixed(5));
                      setLat(newLat);
                      setLng(newLng);
                      handleReverseGeocode(newLat, newLng);
                    }
                  }}
                >
                  <AdvancedMarker
                    position={{ lat, lng }}
                    draggable={true}
                    onDragEnd={(e) => {
                      if (e.latLng) {
                        const newLat = parseFloat(e.latLng.lat().toFixed(5));
                        const newLng = parseFloat(e.latLng.lng().toFixed(5));
                        setLat(newLat);
                        setLng(newLng);
                        handleReverseGeocode(newLat, newLng);
                      }
                    }}
                  />
                </Map>

                {/* Floating GPS Enable Current Location Control on Google Map */}
                <button
                  type="button"
                  onClick={detectCurrentLocation}
                  disabled={gpsLoading}
                  title="Enable Live GPS and fetch address"
                  className="absolute bottom-3 right-3 z-10 px-3.5 py-2 bg-white/95 hover:bg-white text-slate-800 rounded-xl shadow-lg border border-slate-300 text-xs font-bold flex items-center gap-2 transition-all active:scale-95 cursor-pointer backdrop-blur-xs ring-2 ring-emerald-500/20"
                >
                  <Compass className={`w-4 h-4 text-emerald-700 ${gpsLoading ? 'animate-spin' : ''}`} />
                  <span>{gpsLoading ? 'Locating GPS...' : '📍 Enable Current Location'}</span>
                </button>
              </div>

              {/* Detailed Pinned Address Card or Loading State */}
              {isFetchingAddress ? (
                <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-center justify-between gap-2 animate-pulse shadow-xs">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-blue-600 shrink-0" />
                    <span className="font-semibold">
                      Fetching detailed address from Google Maps for pinned coordinates ({lat}° N, {lng}° E)...
                    </span>
                  </div>
                  <span className="text-[10px] text-blue-600 font-mono">Reverse Geocoding</span>
                </div>
              ) : pinnedAddressDetails ? (
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-slate-50 border border-emerald-300 space-y-3 shadow-xs animate-in fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200/80 pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center shadow-xs shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                          📍 Pinned Location Address Details
                        </span>
                        <span className="text-[10px] text-emerald-800 font-medium">
                          Google Maps Geocoding · Pinned at {pinnedAddressDetails.timestamp}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-mono text-emerald-900 bg-white px-2 py-0.5 rounded-md border border-emerald-200 font-semibold shadow-2xs">
                        {pinnedAddressDetails.lat}° N, {pinnedAddressDetails.lng}° E
                      </span>
                      <button
                        type="button"
                        onClick={applyAddressDetailsToForm}
                        className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                        <span>{addressAppliedNotice ? 'Applied to Form ✓' : 'Apply to Form'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Full Formatted Address */}
                  <div className="text-xs space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">
                      Resolved Road / Location Address:
                    </span>
                    <p className="text-slate-900 font-semibold bg-white p-2.5 rounded-lg border border-slate-200 text-xs leading-relaxed shadow-2xs">
                      {pinnedAddressDetails.formatted_address}
                    </p>
                  </div>

                  {/* Structured Address Components */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-2xs">
                      <span className="text-[10px] text-slate-400 block font-semibold">STREET / ROAD</span>
                      <span className="font-bold text-slate-800 text-xs truncate block" title={pinnedAddressDetails.street}>
                        {pinnedAddressDetails.street || 'Nearby Road'}
                      </span>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-2xs">
                      <span className="text-[10px] text-slate-400 block font-semibold">LOCALITY / WARD</span>
                      <span className="font-bold text-slate-800 text-xs truncate block" title={pinnedAddressDetails.area}>
                        {pinnedAddressDetails.area || 'Ward Area'}
                      </span>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-2xs">
                      <span className="text-[10px] text-slate-400 block font-semibold">TALUK / TOWN</span>
                      <span className="font-bold text-slate-800 text-xs truncate block" title={pinnedAddressDetails.taluk}>
                        {pinnedAddressDetails.taluk || taluk}
                      </span>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-2xs">
                      <span className="text-[10px] text-slate-400 block font-semibold">DISTRICT & PIN</span>
                      <span className="font-bold text-slate-800 text-xs truncate block">
                        {pinnedAddressDetails.district || district} {pinnedAddressDetails.postalCode ? `(${pinnedAddressDetails.postalCode})` : ''}
                      </span>
                    </div>
                  </div>
                </div>
              ) : reverseGeocodedAddress ? (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-bold text-emerald-800 shrink-0">Pinned Address:</span>
                    <span className="truncate">{reverseGeocodedAddress}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleReverseGeocode(lat, lng)}
                    className="text-emerald-700 hover:text-emerald-800 font-bold text-xs shrink-0 cursor-pointer"
                  >
                    Refresh Address &rarr;
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Click anywhere on Google Map or drag marker to pin your exact location — street details will be automatically fetched!</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleReverseGeocode(lat, lng)}
                    className="text-emerald-700 hover:text-emerald-800 font-bold underline cursor-pointer shrink-0"
                  >
                    Fetch address for pin &rarr;
                  </button>
                </div>
              )}
            </div>

            {/* Dependent Administrative Hierarchy Form */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Karnataka Administrative Hierarchy (Dependent Order):
                </span>
                <span className="text-[10px] text-emerald-800 font-semibold font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  State &rarr; District &rarr; Taluk &rarr; Hobli &rarr; Village/Town &rarr; Ward
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                {/* 1. State */}
                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">1. State</label>
                  <input
                    type="text"
                    disabled
                    value="Karnataka"
                    className="w-full p-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-semibold shadow-2xs"
                  />
                </div>

                {/* 2. District (All 31 Districts) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-700 font-semibold">2. District *</label>
                    <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                      All 31 Districts
                    </span>
                  </div>
                  <select
                    value={district}
                    onChange={e => handleDistrictChange(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-600 font-medium shadow-xs"
                  >
                    {districtsData.map(d => (
                      <option key={d.name} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                {/* 3. Taluk */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-700 font-semibold">3. Taluk *</label>
                    <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                      {currentDistObj?.taluks.length || 0} Taluks
                    </span>
                  </div>
                  <select
                    value={taluk}
                    onChange={e => handleTalukChange(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-600 font-medium shadow-xs"
                  >
                    {currentDistObj?.taluks.map(t => (
                      <option key={t.name} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>

                {/* 4. Hobli */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-700 font-semibold">
                      4. Hobli (Revenue Circle / ಹೋಬಳಿ) *
                    </label>
                    <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                      {currentTalukObj?.hoblis?.length || 0} Hoblis
                    </span>
                  </div>
                  <select
                    value={hobli}
                    onChange={e => handleHobliChange(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-600 font-medium shadow-xs text-xs"
                  >
                    {currentTalukObj?.hoblis && currentTalukObj.hoblis.length > 0 ? (
                      currentTalukObj.hoblis.map(h => (
                        <option key={h.name} value={h.name}>
                          {h.name} ({h.cities?.length || 0} villages)
                        </option>
                      ))
                    ) : (
                      <option value="Kasaba Hobli">Kasaba Hobli / General</option>
                    )}
                  </select>

                  {/* Respective Hoblis Display Chips */}
                  {currentTalukObj?.hoblis && currentTalukObj.hoblis.length > 1 && (
                    <div className="pt-1">
                      <span className="text-[10px] text-slate-500 font-medium block mb-1">
                        Respective Hoblis in {taluk} (Click to select):
                      </span>
                      <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                        {currentTalukObj.hoblis.map(h => {
                          const isSel = h.name === hobli;
                          return (
                            <button
                              key={h.name}
                              type="button"
                              onClick={() => handleHobliChange(h.name)}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                                isSel
                                  ? 'bg-emerald-800 text-white shadow-2xs'
                                  : 'bg-slate-100 hover:bg-emerald-100 text-slate-700 border border-slate-200'
                              }`}
                            >
                              {h.name} ({h.cities?.length || 0})
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. City / Town / Village / Grama with Manual Entry & Pin Option */}
                <div className="col-span-1 sm:col-span-2 md:col-span-2 p-3 bg-white rounded-xl border border-slate-200 space-y-2.5 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-100 pb-1.5">
                    <div className="flex items-center gap-1.5">
                      <label className="text-slate-800 font-bold text-xs">
                        5. City / Town / Village / Grama (ಗ್ರಾಮ / ಪಟ್ಟಣ) *
                      </label>
                      <span className="text-[10px] font-mono text-emerald-700 font-semibold">
                        ({currentAvailableCities.length} settlements)
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {!isManualVillage && currentTalukObj?.hoblis && currentTalukObj.hoblis.length > 1 && (
                        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md text-[10px]">
                          <button
                            type="button"
                            onClick={() => setVillageFilterMode('hobli')}
                            className={`px-2 py-0.5 rounded font-medium cursor-pointer transition-all ${
                              villageFilterMode === 'hobli' ? 'bg-white text-emerald-900 shadow-2xs font-bold' : 'text-slate-600'
                            }`}
                          >
                            Hobli Villages ({currentHobliObj?.cities?.length || 0})
                          </button>
                          <button
                            type="button"
                            onClick={() => setVillageFilterMode('all')}
                            className={`px-2 py-0.5 rounded font-medium cursor-pointer transition-all ${
                              villageFilterMode === 'all' ? 'bg-white text-emerald-900 shadow-2xs font-bold' : 'text-slate-600'
                            }`}
                          >
                            All Taluk ({allTalukVillages.length})
                          </button>
                        </div>
                      )}

                      <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px]">
                        <button
                          type="button"
                          onClick={() => {
                            setIsManualVillage(false);
                            if (currentAvailableCities.length > 0) {
                              setCity(currentAvailableCities[0].name);
                            }
                          }}
                          className={`px-2 py-0.5 rounded-md font-semibold transition-all cursor-pointer ${
                            !isManualVillage
                              ? 'bg-emerald-800 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Select List
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsManualVillage(true);
                            if (!manualVillage) {
                              setManualVillage(city);
                            }
                          }}
                          className={`px-2 py-0.5 rounded-md font-semibold transition-all cursor-pointer ${
                            isManualVillage
                              ? 'bg-emerald-800 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Enter Manually
                        </button>
                      </div>
                    </div>
                  </div>

                  {!isManualVillage ? (
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <select
                          value={city}
                          onChange={e => handleCityChange(e.target.value)}
                          className="flex-1 p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-600 font-medium text-xs shadow-xs"
                        >
                          {currentAvailableCities.map(c => (
                            <option key={c.name} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            const query = `${city}, ${taluk}, ${district}, Karnataka`;
                            setMapSearchQuery(query);
                            handleSearchOnMap(query);
                          }}
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 shrink-0 cursor-pointer shadow-xs transition-colors"
                          title="Pin this village on Google Maps"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Pin on Map</span>
                        </button>
                      </div>

                      {/* Respective Villages Display Chips */}
                      {currentAvailableCities.length > 1 && (
                        <div className="pt-1 border-t border-slate-100">
                          <span className="text-[10px] text-slate-500 font-medium block mb-1">
                            Respective Villages / Towns in {villageFilterMode === 'hobli' ? hobli : taluk} (Click to select):
                          </span>
                          <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
                            {currentAvailableCities.map(c => {
                              const isSel = c.name === city;
                              return (
                                <button
                                  key={c.name}
                                  type="button"
                                  onClick={() => handleCityChange(c.name)}
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                                    isSel
                                      ? 'bg-emerald-800 text-white shadow-2xs'
                                      : 'bg-slate-100 hover:bg-emerald-50 text-slate-700 border border-slate-200'
                                  }`}
                                >
                                  {c.name}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <p className="text-[10px] text-slate-500">
                        Choose your settlement from this hobli/taluk list, or toggle "Enter Manually" above for remote villages.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          required
                          value={manualVillage}
                          onChange={e => handleManualVillageChange(e.target.value)}
                          placeholder="Type your exact village or town name (e.g. Alur Village, Koodli Grama, Benakatti)..."
                          className="flex-1 p-2 border border-emerald-500 rounded-lg bg-white focus:ring-2 focus:ring-emerald-600 font-medium text-xs shadow-xs"
                        />
                        <button
                          type="button"
                          onClick={handleLocateVillageOnMap}
                          disabled={!manualVillage.trim()}
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 shrink-0 cursor-pointer shadow-xs transition-colors"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Locate on Map</span>
                        </button>
                      </div>
                      <p className="text-[10px] text-emerald-800 font-medium">
                        Click "Locate on Map" to automatically center and pin your village on Google Maps and fetch address details.
                      </p>
                    </div>
                  )}
                </div>

                {/* 6. Ward / Locality */}
                <div className="col-span-1 sm:col-span-2 md:col-span-3 p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-100 pb-1.5">
                    <label className="text-slate-800 font-bold text-xs">
                      6. Area / Locality / Ward *
                    </label>

                    <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px]">
                      <button
                        type="button"
                        onClick={() => {
                          setIsManualWard(false);
                          if (currentCityObj?.wards && currentCityObj.wards.length > 0) {
                            setWard(currentCityObj.wards[0]);
                          }
                        }}
                        className={`px-2 py-0.5 rounded font-semibold transition-all cursor-pointer ${
                          !isManualWard && !isManualVillage
                            ? 'bg-emerald-800 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Preset Wards
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsManualWard(true);
                          if (!manualWard) setManualWard(ward);
                        }}
                        className={`px-2 py-0.5 rounded font-semibold transition-all cursor-pointer ${
                          isManualWard || isManualVillage
                            ? 'bg-emerald-800 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Custom Area / Galli
                      </button>
                    </div>
                  </div>

                  {!isManualWard && !isManualVillage && currentCityObj?.wards && currentCityObj.wards.length > 0 ? (
                    <select
                      value={ward}
                      onChange={e => setWard(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-600 font-medium text-xs"
                    >
                      {currentCityObj.wards.map(w => (
                        <option key={w} value={w}>{w}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      value={isManualWard || isManualVillage ? (manualWard || ward) : ward}
                      onChange={e => handleManualWardChange(e.target.value)}
                      placeholder="e.g. Main Temple Street, Gramatana, Ward 1, Layout Road..."
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-600 font-medium text-xs"
                    />
                  )}
                </div>
              </div>

              {/* 7. Street / Road / Landmark */}
              <div className="text-xs pt-1">
                <label className="text-slate-700 block mb-1 font-bold">
                  7. Street Name, Cross & Nearby Landmark *
                </label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={e => {
                    setStreet(e.target.value);
                    if (stepErrors.street) setStepErrors(prev => ({ ...prev, street: '' }));
                  }}
                  placeholder="e.g. 3rd Main Road, Opposite BDA Complex entrance, near Government Primary School"
                  className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-600 bg-white ${
                    stepErrors.street ? 'border-red-500 ring-1 ring-red-400' : 'border-slate-300'
                  }`}
                />
                {stepErrors.street && (
                  <p className="text-[11px] text-red-600 mt-1 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {stepErrors.street}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Photo and Video Evidence */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase">Step 4 of 8</span>
              <h3 className="text-lg font-bold text-slate-900">Photo & Video Evidence Upload</h3>
              <p className="text-xs text-slate-500">
                Upload clear photographs or short video clips from your gallery or capture live using your device camera.
              </p>
            </div>

            {uploadError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* 4 Distinct Upload & Capture Action Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Option 1: Take Live Photo */}
              <button
                type="button"
                onClick={() => openCameraModal('photo')}
                disabled={uploadLoading || attachments.length >= 5}
                className="border-2 border-dashed border-emerald-300 hover:border-emerald-600 rounded-2xl p-4 text-center space-y-2 transition-all bg-emerald-50/50 hover:bg-emerald-50 cursor-pointer flex flex-col items-center justify-center disabled:opacity-50"
              >
                <div className="w-11 h-11 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 shadow-xs">
                  <Camera className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800">Take Live Photo</span>
                <span className="text-[10px] text-slate-500">Live camera snapshot</span>
              </button>

              {/* Option 2: Record Video */}
              <button
                type="button"
                onClick={() => openCameraModal('video')}
                disabled={uploadLoading || attachments.length >= 5}
                className="border-2 border-dashed border-blue-300 hover:border-blue-600 rounded-2xl p-4 text-center space-y-2 transition-all bg-blue-50/50 hover:bg-blue-50 cursor-pointer flex flex-col items-center justify-center disabled:opacity-50"
              >
                <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 shadow-xs">
                  <Video className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800">Record Video</span>
                <span className="text-[10px] text-slate-500">Live 60s video record</span>
              </button>

              {/* Option 3: Upload Photo */}
              <label className="border-2 border-dashed border-slate-300 hover:border-emerald-600 rounded-2xl p-4 text-center space-y-2 transition-all bg-slate-50 hover:bg-slate-100/70 cursor-pointer flex flex-col items-center justify-center disabled:opacity-50">
                <div className="w-11 h-11 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 shadow-xs">
                  <ImageIcon className="w-5 h-5 text-emerald-700" />
                </div>
                <span className="text-xs font-bold text-slate-800">Upload Photo</span>
                <span className="text-[10px] text-slate-500">JPEG, PNG, WEBP</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/heic"
                  onChange={handleFileUpload}
                  disabled={uploadLoading || attachments.length >= 5}
                  className="hidden"
                />
              </label>

              {/* Option 4: Upload Video */}
              <label className="border-2 border-dashed border-slate-300 hover:border-blue-600 rounded-2xl p-4 text-center space-y-2 transition-all bg-slate-50 hover:bg-slate-100/70 cursor-pointer flex flex-col items-center justify-center disabled:opacity-50">
                <div className="w-11 h-11 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 shadow-xs">
                  <Upload className="w-5 h-5 text-blue-700" />
                </div>
                <span className="text-xs font-bold text-slate-800">Upload Video</span>
                <span className="text-[10px] text-slate-500">MP4, WEBM (Max 15MB)</span>
                <input
                  type="file"
                  accept="video/mp4,video/webm"
                  onChange={handleFileUpload}
                  disabled={uploadLoading || attachments.length >= 5}
                  className="hidden"
                />
              </label>
            </div>

            {/* Direct Mobile Quick-Capture Fallback Bar */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-600 font-medium text-[11px]">
                Mobile quick action camera shortcut:
              </span>
              <div className="flex items-center gap-2">
                <label className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-[11px] font-semibold text-slate-700 cursor-pointer flex items-center gap-1.5 transition-colors">
                  <Camera className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Native Mobile Camera</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileUpload}
                    disabled={uploadLoading || attachments.length >= 5}
                    className="hidden"
                  />
                </label>
                <label className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-[11px] font-semibold text-slate-700 cursor-pointer flex items-center gap-1.5 transition-colors">
                  <Video className="w-3.5 h-3.5 text-blue-700" />
                  <span>Native Video Cam</span>
                  <input
                    type="file"
                    accept="video/*"
                    capture="environment"
                    onChange={handleFileUpload}
                    disabled={uploadLoading || attachments.length >= 5}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {uploadLoading && (
              <div className="text-center text-xs text-emerald-700 font-semibold animate-pulse flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Uploading and encrypting evidence file...</span>
              </div>
            )}

            {/* Attachments Preview Grid with Delete Buttons */}
            {attachments.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Attached Evidence Files ({attachments.length} of 5 max):</span>
                  <span className="text-emerald-700 font-semibold">Preview & verify before submitting</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {attachments.map((att, idx) => (
                    <div key={idx} className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-900 group shadow-xs">
                      {att.type.startsWith('video') ? (
                        <div className="w-full h-28 flex flex-col items-center justify-center bg-slate-800 text-white p-2 text-center">
                          <Video className="w-6 h-6 text-emerald-400 mb-1" />
                          <span className="text-[10px] truncate max-w-full font-mono">{att.name}</span>
                        </div>
                      ) : (
                        <img src={att.url} alt={att.name} className="w-full h-28 object-cover" />
                      )}

                      <button
                        type="button"
                        onClick={() => removeAttachment(idx)}
                        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-md cursor-pointer transition-transform hover:scale-110"
                        title="Remove file"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="p-1 text-[10px] text-slate-200 bg-slate-950/80 truncate px-2">
                        {att.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 5: Complaint Description */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase">Step 5 of 8</span>
              <h3 className="text-lg font-bold text-slate-900">Complaint Description *</h3>
              <p className="text-xs text-slate-500">
                Provide clear details about the waste issue, duration of accumulation, whether it poses a public health risk, foul odor, or stormwater drain blockage.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-700">Detailed Complaint Narrative *</label>
                <span className={`text-[11px] font-mono ${description.length < 10 ? 'text-amber-600' : 'text-slate-500'}`}>
                  {description.length} / 500 characters (min. 10)
                </span>
              </div>
              <textarea
                rows={5}
                required
                maxLength={500}
                value={description}
                onChange={e => {
                  setDescription(e.target.value);
                  if (stepErrors.description) setStepErrors(prev => ({ ...prev, description: '' }));
                }}
                placeholder="e.g. Unsegregated organic kitchen scraps and plastic wrappers dumped on the roadside curb near the residential colony gate for the past 4 days. Strong foul odor, stray dogs and cows scattering the trash across the road and into the drainage canal."
                className={`w-full p-3 text-xs border rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none ${
                  stepErrors.description ? 'border-red-500 ring-1 ring-red-400' : 'border-slate-300'
                }`}
              ></textarea>
              {stepErrors.description && (
                <p className="text-[11px] text-red-600 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {stepErrors.description}
                </p>
              )}
            </div>
          </div>
        )}

        {/* STEP 6: Contact Information */}
        {currentStep === 6 && (
          <div className="space-y-6 max-w-lg mx-auto">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase">Step 6 of 8</span>
              <h3 className="text-lg font-bold text-slate-900">Citizen Verification Details *</h3>
              <p className="text-xs text-slate-500">
                The local ward sanitary inspector or collection supervisor may contact you if additional landmarks are required.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Citizen Name</label>
                <input
                  type="text"
                  disabled
                  value={user ? user.name : 'Guest User (Sign in for eco-rewards)'}
                  className="w-full p-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Contact Mobile Number *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={mobile}
                    onChange={e => {
                      setMobile(e.target.value);
                      if (stepErrors.mobile) setStepErrors(prev => ({ ...prev, mobile: '' }));
                    }}
                    placeholder="10-digit mobile number (e.g. 9876543210)"
                    className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600 font-mono ${
                      stepErrors.mobile ? 'border-red-500 ring-1 ring-red-400' : 'border-slate-300'
                    }`}
                  />
                </div>
                {stepErrors.mobile && (
                  <p className="text-[11px] text-red-600 mt-1 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {stepErrors.mobile}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: Review and Final Verification */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase">Step 7 of 8</span>
              <h3 className="text-lg font-bold text-slate-900">Review Form Before Submission</h3>
              <p className="text-xs text-slate-500">
                Confirm all details below. An official Karnataka SMARTWASTE complaint ticket will be created and dispatched to your ward sanitation division.
              </p>
            </div>

            {submitError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-3 border-b border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[11px]">Waste Category</span>
                  <span className="font-bold text-slate-800">{wasteCategory}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Estimated Weight</span>
                  <span className="font-bold text-emerald-700 font-mono">~{quantityKg} kg</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">District / Taluk</span>
                  <span className="font-bold text-slate-800">{district} &gt; {taluk}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Contact Mobile</span>
                  <span className="font-bold text-slate-800 font-mono">{mobile}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-3 border-b border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[11px]">Complete Administrative Hierarchy:</span>
                  <span className="font-semibold text-slate-800">
                    Karnataka &rarr; {district} &rarr; {taluk} &rarr; {hobli} &rarr; {city} &rarr; {ward}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Street & Landmark:</span>
                  <span className="font-semibold text-slate-800">{street || 'Not specified'}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-3 border-b border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[11px]">Google Map GPS Coordinates:</span>
                  <span className="font-mono text-emerald-800 font-semibold">{lat}° N, {lng}° E</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Evidence Attached:</span>
                  <span className="font-semibold text-slate-800">{attachments.length} file(s) uploaded</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Complaint Description:</span>
                <p className="text-slate-700 mt-0.5 whitespace-pre-wrap">{description || 'No description entered'}</p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 8: Confirmation Screen */}
        {currentStep === 8 && (
          <div className="text-center py-8 space-y-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              {t.submitSuccess}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Your report has been securely registered in the Karnataka SMARTWASTE municipal database.
            </p>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 inline-block text-left max-w-sm w-full space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">{t.complaintIdLabel}:</span>
                <span className="font-mono font-bold text-emerald-700 text-sm">{submittedComplaintId}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Status:</span>
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                  Submitted (Awaiting Ward Verification)
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Eco-Points Earned:</span>
                <span className="font-bold text-emerald-600">+20 Civic Eco-Points</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                onClick={() => setCurrentTab('track')}
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm"
              >
                {t.trackNowBtn} &rarr;
              </button>
              <button
                onClick={() => {
                  setCurrentStep(1);
                  setSubmittedComplaintId(null);
                  setDescription('');
                  setAttachments([]);
                  setStreet('');
                }}
                className="px-5 py-2.5 border border-slate-300 hover:bg-slate-100 rounded-xl text-xs font-semibold cursor-pointer"
              >
                {t.fileComplaintAnotherBtn}
              </button>
            </div>
          </div>
        )}

        {/* Step Navigation Bar */}
        {currentStep < 8 && (
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={handleStepByStepBack}
              className="px-4 py-2 border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-700" />
              <span>
                {currentStep > 1
                  ? (language === 'kn' ? `ಹಂತ ${currentStep - 1} ಕ್ಕೆ ಹಿಂದಿರುಗಿ` : language === 'hi' ? `चरण ${currentStep - 1} पर जाएं` : `Back to Step ${currentStep - 1}`)
                  : (previousTabName ? (language === 'kn' ? `ಹಿಂದಕ್ಕೆ (${previousTabName})` : language === 'hi' ? `वापस (${previousTabName})` : `Back to ${previousTabName}`) : t.btnBack)}
              </span>
            </button>

            {currentStep < 7 ? (
              <button
                onClick={handleNextStep}
                className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>
                  {language === 'kn'
                    ? `ಹಂತ ${currentStep + 1} ಕ್ಕೆ ಮುಂದುವರಿಯಿರಿ`
                    : language === 'hi'
                    ? `चरण ${currentStep + 1} पर जाएं`
                    : `Continue to Step ${currentStep + 1}`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmitComplaint}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                {isSubmitting
                  ? (language === 'kn' ? 'ದೂರು ದಾಖಲಾಗುತ್ತಿದೆ...' : language === 'hi' ? 'शिकायत दर्ज हो रही है...' : 'Registering Complaint...')
                  : t.btnSubmitComplaint}
                <Sparkles className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
        {/* Camera and Video Recorder Interactive Modal */}
        {isCameraModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
            <div className="bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 w-full max-w-lg overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    {cameraMode === 'photo' ? <Camera className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {cameraMode === 'photo' ? 'Take Live Photo Evidence' : 'Record Video Evidence'}
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      {cameraMode === 'photo' ? 'Capture clear picture of the civic waste hotspot' : 'Record up to 60 seconds of video evidence with sound'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={toggleCameraFacing}
                    title="Flip Camera (Front / Rear)"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={closeCameraModal}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Viewfinder / Preview Body */}
              <div className="p-4 space-y-4">
                {cameraError ? (
                  <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs space-y-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <span>{cameraError}</span>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => initCamera(cameraMode, cameraFacing)}
                        className="px-3 py-1.5 bg-red-800 hover:bg-red-700 text-white rounded-lg font-semibold cursor-pointer text-xs"
                      >
                        Try Again
                      </button>
                      <button
                        type="button"
                        onClick={closeCameraModal}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold cursor-pointer text-xs"
                      >
                        Close & Upload File Instead
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-72 sm:h-80 bg-black rounded-xl overflow-hidden flex items-center justify-center">
                    {/* Live Video stream when not captured/recorded yet */}
                    {!capturedPhotoUrl && !recordedVideoUrl && (
                      <video
                        ref={videoElementRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                    )}

                    {/* Photo Snapshot Preview */}
                    {capturedPhotoUrl && (
                      <img
                        src={capturedPhotoUrl}
                        alt="Captured snapshot preview"
                        className="w-full h-full object-contain bg-black"
                      />
                    )}

                    {/* Recorded Video Playback Preview */}
                    {recordedVideoUrl && (
                      <video
                        src={recordedVideoUrl}
                        controls
                        autoPlay
                        playsInline
                        className="w-full h-full object-contain bg-black"
                      />
                    )}

                    {/* Camera initializing indicator */}
                    {cameraInitializing && (
                      <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-2 text-xs text-emerald-400">
                        <RefreshCw className="w-6 h-6 animate-spin" />
                        <span>Connecting to device optical sensor...</span>
                      </div>
                    )}

                    {/* Recording in progress banner */}
                    {isRecordingVideo && (
                      <div className="absolute top-3 left-3 bg-red-600/90 text-white px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-2 shadow-lg animate-pulse">
                        <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
                        <span>
                          REC 00:{recordingSeconds < 10 ? '0' : ''}{recordingSeconds} / 01:00
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Bottom Controls */}
                {!cameraError && (
                  <div className="flex items-center justify-between pt-1">
                    {/* Photo Mode Controls */}
                    {cameraMode === 'photo' && !capturedPhotoUrl && (
                      <div className="w-full flex justify-center">
                        <button
                          type="button"
                          onClick={captureLivePhoto}
                          disabled={cameraInitializing}
                          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold text-xs flex items-center gap-2 shadow-lg hover:scale-105 transition-all cursor-pointer disabled:opacity-50"
                        >
                          <Camera className="w-4 h-4" />
                          <span>Capture Photo</span>
                        </button>
                      </div>
                    )}

                    {cameraMode === 'photo' && capturedPhotoUrl && (
                      <div className="w-full flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={retakePhoto}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                        >
                          Retake Photo
                        </button>
                        <button
                          type="button"
                          onClick={confirmUploadPhoto}
                          disabled={uploadLoading}
                          className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{uploadLoading ? 'Uploading...' : 'Confirm & Attach Photo'}</span>
                        </button>
                      </div>
                    )}

                    {/* Video Mode Controls */}
                    {cameraMode === 'video' && !recordedVideoUrl && (
                      <div className="w-full flex justify-center">
                        {!isRecordingVideo ? (
                          <button
                            type="button"
                            onClick={startVideoRecording}
                            disabled={cameraInitializing}
                            className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-full font-bold text-xs flex items-center gap-2 shadow-lg hover:scale-105 transition-all cursor-pointer disabled:opacity-50"
                          >
                            <Circle className="w-4 h-4 fill-current text-white" />
                            <span>Start Recording</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={stopVideoRecording}
                            className="px-6 py-2.5 bg-red-700 hover:bg-red-600 text-white rounded-full font-bold text-xs flex items-center gap-2 shadow-lg hover:scale-105 transition-all cursor-pointer"
                          >
                            <Square className="w-4 h-4 fill-current text-white" />
                            <span>Stop Recording</span>
                          </button>
                        )}
                      </div>
                    )}

                    {cameraMode === 'video' && recordedVideoUrl && (
                      <div className="w-full flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={retakeVideo}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                        >
                          Re-record Video
                        </button>
                        <button
                          type="button"
                          onClick={confirmUploadVideo}
                          disabled={uploadLoading}
                          className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{uploadLoading ? 'Uploading...' : 'Confirm & Attach Video'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
