const checkSuperAdmin = (req, res, next) => {
    // req.user JWT tokendan keladi (unga qadar login qilingan bo'lishi shart)
    if (!req.user || req.user.role !== 'super_admin') {
        return res.status(403).json({ 
            message: "Ruxsat berilmagan! Faqat super admingina yangi admin yarata oladi." 
        });
    }
    next();
};

module.exports = {
     checkSuperAdmin
};
