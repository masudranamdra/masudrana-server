import Image from '../models/Image.js';
import Video from '../models/Video.js';

const normalizeImagePayload = (body) => ({
  title: body.title || body.description || 'Untitled image',
  url: body.url || body.imageUrl,
  category: body.category || 'Gallery',
  description: body.description || '',
  featured: Boolean(body.featured),
});

const normalizeVideoPayload = (body) => {
  const url = body.url || body.videoUrl;
  return {
    title: body.title,
    url,
    platform: body.platform || (String(url || '').includes('drive.google.com') ? 'GoogleDrive' : 'YouTube'),
    description: body.description || '',
    thumbnail: body.thumbnail || '',
    featured: Boolean(body.featured),
  };
};

// --- IMAGE CONTROLLERS ---

// @desc    Get all images
// @route   GET /api/gallery/images
// @access  Private (Logged In Users Only)
export const getImages = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.featured === 'true') {
      filter.featured = true;
    }
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const images = await Image.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: images.length, data: images });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new image
// @route   POST /api/gallery/images
// @access  Private/Admin
export const createImage = async (req, res, next) => {
  try {
    const image = await Image.create(normalizeImagePayload(req.body));
    res.status(201).json({ success: true, data: image });
  } catch (error) {
    next(error);
  }
};

// @desc    Update image
// @route   PUT /api/gallery/images/:id
// @access  Private/Admin
export const updateImage = async (req, res, next) => {
  try {
    const image = await Image.findByIdAndUpdate(req.params.id, normalizeImagePayload(req.body), {
      new: true,
      runValidators: true,
    });

    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    res.status(200).json({ success: true, data: image });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete image
// @route   DELETE /api/gallery/images/:id
// @access  Private/Admin
export const deleteImage = async (req, res, next) => {
  try {
    const image = await Image.findByIdAndDelete(req.params.id);

    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    res.status(200).json({ success: true, data: {}, message: 'Image deleted successfully' });
  } catch (error) {
    next(error);
  }
};


// --- VIDEO CONTROLLERS ---

// @desc    Get all videos
// @route   GET /api/gallery/videos
// @access  Private (Logged In Users Only)
export const getVideos = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.featured === 'true') {
      filter.featured = true;
    }

    const videos = await Video.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: videos.length, data: videos });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new video
// @route   POST /api/gallery/videos
// @access  Private/Admin
export const createVideo = async (req, res, next) => {
  try {
    const video = await Video.create(normalizeVideoPayload(req.body));
    res.status(201).json({ success: true, data: video });
  } catch (error) {
    next(error);
  }
};

// @desc    Update video
// @route   PUT /api/gallery/videos/:id
// @access  Private/Admin
export const updateVideo = async (req, res, next) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, normalizeVideoPayload(req.body), {
      new: true,
      runValidators: true,
    });

    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    res.status(200).json({ success: true, data: video });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete video
// @route   DELETE /api/gallery/videos/:id
// @access  Private/Admin
export const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);

    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    res.status(200).json({ success: true, data: {}, message: 'Video deleted successfully' });
  } catch (error) {
    next(error);
  }
};
