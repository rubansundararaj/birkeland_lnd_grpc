const birkeland_lnd_events_item = require("test_birkeland_lnd/mongoose_models/birkeland_lnd_event_model");
const {
  LND_SUBSCRIPTION_OPERATIONS,
} = require("test_birkeland_lnd/operations");

const get_lnd_event_list = async (req, res) => {
  return res
    .status(200)
    .send({ success: true, message: LND_SUBSCRIPTION_OPERATIONS });
};

const get_event_info_of_operation = async (req, res) => {
  try {
    const { operation } = req.query;
    if (!operation) {
      return res
        .status(400)
        .send({ success: false, message: "operation is required" });
    }
    let filter = {
      operation: operation,
    };
    let result = (await birkeland_lnd_events_item.find(filter)).reverse();
    return res.status(200).send({ success: true, message: result });
  } catch (err) {
    return res.status(400).send({ success: false });
  }
};

const get_event_info_by_operation = async (req, res) => {
  try {
    const { operation, page, limit } = req.query;

    if (!operation || !page || !limit) {
      return res
        .status(400)
        .send({ success: false, message: "missing params" });
    }
    let filter = {
      operation: operation,
    };

    const int_page = parseInt(page) || 1;
    const int_limit = parseInt(limit) || 10;
    const startIndex = (int_page - 1) * int_limit;
    const endIndex = int_page * int_limit;

    const count = await birkeland_lnd_events_item.countDocuments();

    let result = await birkeland_lnd_events_item
      .find(filter)
      .sort({ _id: -1 })
      .limit(int_limit);
    const slicedResults = result.slice(startIndex, endIndex);

    const pagination = {};
    if (endIndex < count) {
      pagination.next = {
        page: int_page + 1,
        limit: int_limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: int_page - 1,
        limit: int_limit,
      };
    }

    return res
      .status(200)
      .send({ success: true, message: slicedResults, pagination });
  } catch (err) {
    return res.status(400).send({ success: false });
  }
};

const get_event_data_by_date = async (req, res) => {
  try {
    const { operation, date } = req.query;
    if (!operation || !date ) {
      return res
        .status(400)
        .send({ success: false, message: "missing params" });
    }
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    let filter = {
      operation: operation,
      created_at: {
        $gte: startOfDay,
        // $lte: endOfDay,
      },
    };

    let result = await birkeland_lnd_events_item.find(filter).sort({ _id: -1 });

    return res
      .status(200)
      .send({ success: true, message: result});
  } catch (err) {
    return res.status(400).send({ success: false });
  }
};

const get_event_info = async (req, res) => {
  try {
    const { page, limit } = req.query;
    if (!page || !limit) {
      return res
        .status(400)
        .send({ success: false, message: "page and limit are required" });
    }

    const int_page = parseInt(req.query.page) || 1;
    const int_limit = parseInt(req.query.limit) || 10;
    const startIndex = (int_page - 1) * int_limit;
    const endIndex = int_page * int_limit;

    const count = await birkeland_lnd_events_item.countDocuments();

    let result = await birkeland_lnd_events_item
      .find({})
      .sort({ _id: -1 })
      .limit(int_limit);
    const slicedResults = result.slice(startIndex, endIndex);

    const pagination = {};
    if (endIndex < count) {
      pagination.next = {
        page: int_page + 1,
        limit: int_limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: int_page - 1,
        limit: int_limit,
      };
    }

    return res
      .status(200)
      .send({ success: true, message: slicedResults, pagination });
  } catch (err) {
    return res.status(400).send({ success: false });
  }
};

module.exports = {
  get_event_data_by_date,
  get_event_info_of_operation,
  get_event_info,
  get_lnd_event_list,
  get_event_info_by_operation,
};